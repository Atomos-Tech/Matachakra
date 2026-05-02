/**
 * vitest.config.ts
 *
 * Vitest configuration for Matachakra.
 *
 * Why not Jest?
 * This project uses Vite, ESM, and @/* path aliases. Jest requires
 * babel-jest + ts-jest + moduleNameMapper for all of that.
 * Vitest reads vite.config.ts natively — zero extra config needed.
 */
import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node", // Server-side code; no DOM needed for these tests
    include: ["__tests__/**/*.test.ts", "__tests__/**/*.spec.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/lib/**/*.ts", "src/actions/**/*.ts"],
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
