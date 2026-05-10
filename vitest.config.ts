import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    css: false,
    passWithNoTests: true,
    // Playwright owns e2e/; .claude/ holds temporary worktrees.
    exclude: ["**/node_modules/**", "**/dist/**", "e2e/**", ".claude/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{ts,tsx}"],
      // Coverage % gates Tier A only (logic, route handlers, middleware,
      // hooks). Tier C paths — presentational components, static content,
      // type-only files, RSC pages/layouts whose behavior is covered by
      // Playwright — are excluded so Tier C additions don't fight the
      // threshold. Tier B components are still tested for behavior; their
      // tests run, they just don't contribute to the % gate.
      // See docs/test-coverage-audit.md.
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/test/**",
        "src/**/*.d.ts",
        "src/sanity/**",
        "src/app/studio/**",
        // Tier C — presentational + static content
        "src/components/**",
        "src/lib/content/**",
        "src/lib/fixtures/**",
        "src/lib/types/**",
        "src/lib/search/**",
        // Pages/layouts/error boundaries/icons — Playwright covers behavior
        "src/app/**/*.tsx",
      ],
      // Ratchet policy: thresholds equal current baseline (rounded down).
      // When new tests land, raise these to the new baseline so coverage
      // can never silently regress. See docs/test-coverage-audit.md.
      thresholds: {
        statements: 31,
        branches: 27,
        functions: 27,
        lines: 31,
      },
    },
  },
});
