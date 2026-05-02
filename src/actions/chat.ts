/**
 * actions/chat.ts
 *
 * TanStack Start server function — the secure backend endpoint for the
 * Matachakra AI assistant.
 *
 * `createServerFn` executes exclusively on the server (Node.js / Cloud Run),
 * meaning secrets like GEMINI_API_KEY are NEVER sent to the client.
 *
 * API chaining note:
 *   .inputValidator()  — validates & types the incoming data
 *   .handler()         — the actual server logic
 * (NOT .validator() — that is a Vite-only dev stub, not in the real runtime.)
 *
 * Request flow:
 *   1. Validate & sanitise user input (length, injection patterns).
 *   2. Check Firestore cache (election_faqs collection).
 *   3a. Cache HIT  → return cached answer immediately (zero Gemini cost).
 *   3b. Cache MISS → call Gemini 2.0 Flash with locked system prompt.
 *   4. Write successful Gemini responses back to cache for future users.
 *   5. Return structured response to client.
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getAnswerFromCache, writeAnswerToCache } from "@/lib/firebase";
import { askGemini, sanitiseInput } from "@/lib/gemini";

export const getMapsApiKey = createServerFn({ method: "GET" }).handler(() => {
  return process.env.VITE_GOOGLE_MAPS_API_KEY || "";
});

// ── Input schema (Zod) ────────────────────────────────────────────────────────

const ChatRequestSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Message cannot be empty.")
    .max(500, "Input exceeds 500 character limit."),

  conversationHistory: z
    .array(
      z.object({
        role: z.enum(["user", "model"]),
        text: z.string().max(2000),
      }),
    )
    .max(10) // Cap history to last 10 turns to prevent context inflation
    .optional()
    .default([]),
});

// ── Response types ────────────────────────────────────────────────────────────

export interface ChatResponse {
  ok: true;
  answer: string;
  source: "firestore_cache" | "gemini";
}

export interface ChatErrorResponse {
  ok: false;
  status: number;
  error: string;
}

export type ChatResult = ChatResponse | ChatErrorResponse;

// ── Server function ───────────────────────────────────────────────────────────

export const sendChatMessage = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) => {
    const result = ChatRequestSchema.safeParse(raw);
    if (!result.success) {
      throw new Error(result.error.issues.map((i) => i.message).join(". "));
    }
    return result.data;
  })
  .handler(async ({ data }): Promise<ChatResult> => {
    const { message, conversationHistory } = data;

    // ── Step 1: Sanitise input (defence-in-depth, also done in gemini.ts) ──
    const sanitised = sanitiseInput(message);
    if (!sanitised.ok) {
      return { ok: false, status: sanitised.status, error: sanitised.error };
    }

    // ── Step 2: Check Firestore cache ───────────────────────────────────────
    const cacheResult = await getAnswerFromCache(sanitised.value);
    if (cacheResult.hit) {
      return {
        ok: true,
        answer: cacheResult.answer,
        source: "firestore_cache",
      };
    }

    // ── Step 3: Cache miss → call Gemini ────────────────────────────────────
    const geminiResult = await askGemini({
      message: sanitised.value,
      conversationHistory,
    });

    if (!geminiResult.ok) {
      return { ok: false, status: geminiResult.status, error: geminiResult.error };
    }

    // ── Step 4: Populate cache (fire-and-forget) ─────────────────────────────
    // Only cache if the answer is substantive (> 50 chars) to avoid
    // caching "I don't know" or refusal messages.
    if (geminiResult.answer.length > 50) {
      writeAnswerToCache(geminiResult.keywords, geminiResult.answer).catch(() => {
        console.warn("[Matachakra] Failed to write Gemini response to cache.");
      });
    }

    return {
      ok: true,
      answer: geminiResult.answer,
      source: "gemini",
    };
  });
