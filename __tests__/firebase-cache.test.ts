/**
 * __tests__/firebase-cache.test.ts
 *
 * Unit tests for the Firestore REST cache layer (lib/firebase.ts).
 *
 * Since Firestore is a live external service, we mock the global fetch()
 * to verify the cache logic without network calls — this is the correct
 * approach for unit testing network-dependent code.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// We test the internal logic by importing the raw tokenise + scoreMatch helpers
// exposed indirectly through the module behaviour.
// For the public API, we mock fetch to simulate Firestore responses.

// ── Mock fetch globally ───────────────────────────────────────────────────────

const originalFetch = globalThis.fetch;

function makeFetchMock(documents: unknown[]) {
  return vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ documents }),
  });
}

function makeFirestoreDoc(keywords: string[], answer: string, hits = 0) {
  return {
    name: `projects/test/databases/(default)/documents/election_faqs/doc1`,
    fields: {
      keywords: {
        arrayValue: {
          values: keywords.map((k) => ({ stringValue: k })),
        },
      },
      answer: { stringValue: answer },
      hits: { integerValue: String(hits) },
    },
  };
}

// ── Cache matching tests ──────────────────────────────────────────────────────

describe("Firebase cache — getAnswerFromCache", () => {
  beforeEach(() => {
    // Set env vars for the module to activate
    vi.stubEnv("VITE_FIREBASE_PROJECT_ID", "test-project");
    vi.stubEnv("VITE_FIREBASE_API_KEY", "test-api-key");
    vi.stubEnv("VITE_FIREBASE_CACHE_COLLECTION", "election_faqs");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    globalThis.fetch = originalFetch;
  });

  it("returns cache HIT when keywords score >= 0.5", async () => {
    // Simulate a Firestore doc with keywords [epic, card, voter, id]
    const doc = makeFirestoreDoc(
      ["epic", "card", "voter"],
      "Your EPIC card is your primary voter ID.",
    );
    globalThis.fetch = makeFetchMock([doc]);

    const { getAnswerFromCache } = await import("../src/lib/firebase");
    const result = await getAnswerFromCache("What is an EPIC card for voter?");
    // epic, card, voter all match → score = 3/3 = 1.0 → HIT
    expect(result.hit).toBe(true);
    if (result.hit) {
      expect(result.answer).toContain("EPIC card");
      expect(result.source).toBe("firestore_cache");
    }
  });

  it("returns cache MISS when no documents match", async () => {
    const doc = makeFirestoreDoc(
      ["postal", "ballot", "overseas"],
      "Postal ballots allow overseas voters to vote.",
    );
    globalThis.fetch = makeFetchMock([doc]);

    const { getAnswerFromCache } = await import("../src/lib/firebase");
    // Completely unrelated query
    const result = await getAnswerFromCache("What is an EPIC card?");
    expect(result.hit).toBe(false);
  });

  it("returns cache MISS when Firestore returns no documents", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ documents: [] }),
    });

    const { getAnswerFromCache } = await import("../src/lib/firebase");
    const result = await getAnswerFromCache("How do I vote?");
    expect(result.hit).toBe(false);
  });

  it("returns cache MISS gracefully on network error (never throws)", async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    const { getAnswerFromCache } = await import("../src/lib/firebase");
    // Must not throw — graceful degradation to Gemini
    await expect(
      getAnswerFromCache("What is registration?"),
    ).resolves.toEqual({ hit: false });
  });

  it("returns cache MISS when Firebase is not configured", async () => {
    vi.unstubAllEnvs();
    vi.stubEnv("VITE_FIREBASE_PROJECT_ID", "");
    vi.stubEnv("VITE_FIREBASE_API_KEY", "");

    const { getAnswerFromCache } = await import("../src/lib/firebase");
    const result = await getAnswerFromCache("What is an EPIC card?");
    expect(result.hit).toBe(false);
  });
});

describe("writeAnswerToCache", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_FIREBASE_PROJECT_ID", "test-project");
    vi.stubEnv("VITE_FIREBASE_API_KEY", "test-api-key");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    globalThis.fetch = originalFetch;
  });

  it("calls Firestore PATCH when project is configured", async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true });
    globalThis.fetch = mockFetch;

    const { writeAnswerToCache } = await import("../src/lib/firebase");
    await writeAnswerToCache(["epic", "card"], "Your EPIC card is...");

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("test-project"),
      expect.objectContaining({ method: "PATCH" }),
    );
  });

  it("does not call fetch when project is not configured", async () => {
    vi.stubEnv("VITE_FIREBASE_PROJECT_ID", "");
    const mockFetch = vi.fn();
    globalThis.fetch = mockFetch;

    const { writeAnswerToCache } = await import("../src/lib/firebase");
    await writeAnswerToCache(["epic"], "answer");
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("does not throw when fetch fails", async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("timeout"));

    const { writeAnswerToCache } = await import("../src/lib/firebase");
    await expect(
      writeAnswerToCache(["epic"], "answer"),
    ).resolves.toBeUndefined();
  });

  it("skips write for empty keyword array", async () => {
    const mockFetch = vi.fn();
    globalThis.fetch = mockFetch;

    const { writeAnswerToCache } = await import("../src/lib/firebase");
    await writeAnswerToCache([], "answer");
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
