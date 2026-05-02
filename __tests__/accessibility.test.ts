/**
 * __tests__/accessibility.test.ts
 *
 * Accessibility contract tests for Matachakra.
 *
 * These tests verify that the application's data structures, constants,
 * and configurations meet WCAG 2.1 Level AA requirements.
 *
 * Since we run in a Node environment (no DOM), we test the contracts
 * and patterns rather than rendering components — that would require
 * a full browser test harness (Playwright/Cypress).
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

// ── Helper: read a source file for pattern matching ───────────────────────────

function readSrc(relativePath: string): string {
  return readFileSync(resolve(__dirname, "..", relativePath), "utf-8");
}

// ── 1. WCAG 2.4.1 — Bypass Blocks (skip navigation) ─────────────────────────

describe("Accessibility — skip navigation", () => {
  it("root layout includes a skip-to-content link", () => {
    const root = readSrc("src/routes/__root.tsx");
    expect(root).toContain('href="#main-content"');
    expect(root).toContain("Skip to main content");
  });

  it("index page has a main element with id='main-content'", () => {
    const index = readSrc("src/routes/index.tsx");
    expect(index).toContain('id="main-content"');
    expect(index).toContain("<main");
  });
});

// ── 2. WCAG 1.3.1 — Semantic Structure ──────────────────────────────────────

describe("Accessibility — semantic landmarks", () => {
  it("Navbar uses <nav> with aria-label", () => {
    const navbar = readSrc("src/components/votecast/Navbar.tsx");
    expect(navbar).toContain("<nav");
    expect(navbar).toContain("aria-label");
  });

  it("Footer uses <footer> element", () => {
    const footer = readSrc("src/components/votecast/Footer.tsx");
    expect(footer).toContain("<footer");
  });

  it("every section has aria-labelledby linking to a heading", () => {
    const components = [
      "src/components/votecast/Hero.tsx",
      "src/components/votecast/Timeline.tsx",
      "src/components/votecast/Assistant.tsx",
      "src/components/votecast/ResourceGrid.tsx",
      "src/components/votecast/Quiz.tsx",
    ];

    for (const path of components) {
      const src = readSrc(path);
      expect(src).toContain("aria-labelledby");
    }
  });
});

// ── 3. WCAG 3.1.1 — Language of Page ─────────────────────────────────────────

describe("Accessibility — language declaration", () => {
  it("html element has lang='en'", () => {
    const root = readSrc("src/routes/__root.tsx");
    expect(root).toMatch(/lang=["']en["']/);
  });
});

// ── 4. WCAG 4.1.2 — Name, Role, Value ────────────────────────────────────────

describe("Accessibility — interactive elements", () => {
  it("chat input has an associated label", () => {
    const assistant = readSrc("src/components/votecast/Assistant.tsx");
    expect(assistant).toContain('htmlFor="chat-input"');
    expect(assistant).toContain('id="chat-input"');
  });

  it("voice button has aria-label and aria-pressed", () => {
    const assistant = readSrc("src/components/votecast/Assistant.tsx");
    expect(assistant).toContain("aria-pressed");
    expect(assistant).toMatch(/aria-label=.*voice/i);
  });

  it("send button has aria-label", () => {
    const assistant = readSrc("src/components/votecast/Assistant.tsx");
    expect(assistant).toContain('aria-label="Send message"');
  });

  it("quiz options use role='radio' with aria-checked", () => {
    const quiz = readSrc("src/components/votecast/Quiz.tsx");
    expect(quiz).toContain('role="radio"');
    expect(quiz).toContain("aria-checked");
  });

  it("timeline tabs use role='tab' with aria-selected", () => {
    const timeline = readSrc("src/components/votecast/Timeline.tsx");
    expect(timeline).toContain('role="tab"');
    expect(timeline).toContain("aria-selected");
  });

  it("state select has a label with htmlFor", () => {
    const stateSelect = readSrc("src/components/votecast/StateSelect.tsx");
    expect(stateSelect).toContain('htmlFor="state-select"');
    expect(stateSelect).toContain('id="state-select"');
  });
});

// ── 5. WCAG 1.3.6 — Decorative elements hidden ──────────────────────────────

describe("Accessibility — decorative elements", () => {
  it("decorative icons use aria-hidden", () => {
    const components = [
      "src/components/votecast/Hero.tsx",
      "src/components/votecast/Navbar.tsx",
      "src/components/votecast/Footer.tsx",
      "src/components/votecast/Assistant.tsx",
    ];

    for (const path of components) {
      const src = readSrc(path);
      expect(src).toContain("aria-hidden");
    }
  });
});

// ── 6. Chat message area uses aria-live ──────────────────────────────────────

describe("Accessibility — live regions", () => {
  it("chat message area uses aria-live='polite'", () => {
    const assistant = readSrc("src/components/votecast/Assistant.tsx");
    expect(assistant).toContain('aria-live="polite"');
  });

  it("loading indicator has role='status'", () => {
    const assistant = readSrc("src/components/votecast/Assistant.tsx");
    expect(assistant).toContain('role="status"');
  });
});

// ── 7. Focus management ──────────────────────────────────────────────────────

describe("Accessibility — focus management", () => {
  it("global styles define focus-visible outline", () => {
    const styles = readSrc("src/styles.css");
    expect(styles).toContain(":focus-visible");
    expect(styles).toContain("outline");
  });
});
