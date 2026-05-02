/**
 * lib/firebase.ts
 *
 * Google Cloud Run / Node.js compatible Firestore cache layer.
 *
 * WHY NOT the Firebase Node.js SDK?
 * The official `firebase-admin` SDK has large cold-start overhead and
 * bundles Node.js-native internals. We talk directly to the Firestore
 * REST API via fetch — zero extra dependencies, works in every runtime
 * (Node.js, Cloudflare Workers, Deno, etc.).
 *
 * Collection schema (election_faqs):
 *   Document ID : normalised keyword key (e.g. "epic_voter_card")
 *   Fields:
 *     keywords : string[]  — trigger keywords for fuzzy matching
 *     answer   : string    — cached response text (Markdown supported)
 *     hits     : number    — read counter for analytics
 *
 * Env vars (read lazily so tests can stub them):
 *   VITE_FIREBASE_PROJECT_ID     — Firebase project ID
 *   VITE_FIREBASE_API_KEY        — Firebase Web API key
 *   VITE_FIREBASE_CACHE_COLLECTION — Firestore collection name (default: election_faqs)
 */

// ── Env helpers (lazy — evaluated at call time, not module load time) ─────────

/** Read an env var from import.meta.env (Vite) or process.env (Node.js). */
function readEnv(key: string): string {
  // import.meta.env is a Vite build-time object (replaced at bundle time).
  // In Node.js production, we fall back to process.env.
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const viteVal = (import.meta.env as any)?.[key];
    if (viteVal) return viteVal;
  } catch {
    // import.meta not available in some test runners
  }
  return process.env[key] ?? "";
}

function getProjectId() {
  return readEnv("VITE_FIREBASE_PROJECT_ID");
}
function getApiKey() {
  return readEnv("VITE_FIREBASE_API_KEY");
}
function getCollection() {
  return readEnv("VITE_FIREBASE_CACHE_COLLECTION") || "election_faqs";
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface FirestoreStringValue {
  stringValue: string;
}
interface FirestoreIntValue {
  integerValue: string;
}
interface FirestoreArrayValue {
  arrayValue: { values?: FirestoreStringValue[] };
}

interface FirestoreDocument {
  name: string;
  fields: {
    keywords?: FirestoreArrayValue;
    answer?: FirestoreStringValue;
    hits?: FirestoreIntValue;
  };
}

interface FirestoreListResponse {
  documents?: FirestoreDocument[];
}

// ── Keyword matching ──────────────────────────────────────────────────────────

/**
 * Tokenises a query string into a Set of meaningful words (≥ 3 chars).
 * Strips punctuation and lowercases for case-insensitive matching.
 */
function tokenise(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 3),
  );
}

/**
 * Scores a document's keyword array against query tokens.
 * @returns 0–1. A score ≥ MATCH_THRESHOLD is a cache hit.
 */
const MATCH_THRESHOLD = 0.5;

function scoreMatch(docKeywords: string[], queryTokens: Set<string>): number {
  if (!docKeywords.length) return 0;
  const hits = docKeywords.filter((kw) => queryTokens.has(kw.toLowerCase())).length;
  return hits / docKeywords.length;
}

// ── REST helpers ──────────────────────────────────────────────────────────────

function buildBaseUrl(): string {
  return `https://firestore.googleapis.com/v1/projects/${getProjectId()}/databases/(default)/documents`;
}

async function listDocuments(): Promise<FirestoreDocument[]> {
  const url = `${buildBaseUrl()}/${getCollection()}?key=${getApiKey()}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data: FirestoreListResponse = await res.json();
  return data.documents ?? [];
}

/** Fire-and-forget: increment hit counter on a matched document. */
function incrementHits(docName: string, currentHits: number): void {
  const url = `${docName}?updateMask.fieldPaths=hits&key=${getApiKey()}`;
  fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fields: { hits: { integerValue: String(currentHits + 1) } },
    }),
  }).catch(() => {
    // Non-critical analytics — swallow errors silently
  });
}

// ── Public API ────────────────────────────────────────────────────────────────

export interface CacheResult {
  hit: true;
  answer: string;
  source: "firestore_cache";
}

export interface CacheMiss {
  hit: false;
}

/**
 * Checks the Firestore `election_faqs` collection for a cached answer.
 *
 * Algorithm:
 *   1. Tokenise the user query.
 *   2. Fetch all FAQ documents (small collection: 20–30 docs, ~5ms RTT).
 *   3. Score each document's keywords against query tokens.
 *   4. Return the best match if it meets the 50% threshold.
 *
 * @param query - Raw user query (max 500 chars enforced upstream).
 * @returns CacheResult with answer, or CacheMiss — never throws.
 */
export async function getAnswerFromCache(query: string): Promise<CacheResult | CacheMiss> {
  const projectId = getProjectId();
  const apiKey = getApiKey();

  if (!projectId || !apiKey) {
    return { hit: false };
  }

  try {
    const queryTokens = tokenise(query);
    const docs = await listDocuments();

    let bestScore = 0;
    let bestDoc: FirestoreDocument | null = null;

    for (const doc of docs) {
      const keywords =
        doc.fields.keywords?.arrayValue?.values?.map((v) => v.stringValue) ?? [];
      const score = scoreMatch(keywords, queryTokens);
      if (score > bestScore) {
        bestScore = score;
        bestDoc = doc;
      }
    }

    if (bestScore >= MATCH_THRESHOLD && bestDoc?.fields.answer?.stringValue) {
      const currentHits = parseInt(bestDoc.fields.hits?.integerValue ?? "0", 10);
      incrementHits(bestDoc.name, currentHits);
      return {
        hit: true,
        answer: bestDoc.fields.answer.stringValue,
        source: "firestore_cache",
      };
    }

    return { hit: false };
  } catch (err) {
    console.warn("[Matachakra] Firestore cache lookup failed:", err);
    return { hit: false };
  }
}

/**
 * Writes a new answer to the Firestore cache (organic cache seeding).
 * Called after each successful Gemini response.
 * Never throws — errors are logged and swallowed.
 *
 * @param keywords - Extracted keywords to use for future matching.
 * @param answer   - Gemini-generated answer text.
 */
export async function writeAnswerToCache(keywords: string[], answer: string): Promise<void> {
  const projectId = getProjectId();
  const apiKey = getApiKey();

  if (!projectId || !apiKey) return;

  const docId = keywords
    .map((k) => k.toLowerCase())
    .sort()
    .join("_")
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 80);

  if (!docId) return;

  const url = `${buildBaseUrl()}/${getCollection()}/${docId}?key=${apiKey}`;

  try {
    await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: {
          keywords: {
            arrayValue: {
              values: keywords.map((k) => ({ stringValue: k.toLowerCase() })),
            },
          },
          answer: { stringValue: answer },
          hits: { integerValue: "1" },
        },
      }),
    });
  } catch (err) {
    console.warn("[Matachakra] Failed to write to Firestore cache:", err);
  }
}
