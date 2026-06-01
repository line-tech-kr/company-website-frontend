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
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/test/**",
        "src/**/*.d.ts",
        "src/sanity/**",
        "src/app/studio/**",
      ],
      // Baseline floored to whole percent; raise (never lower) as coverage grows.
      thresholds: {
        statements: 41,
        branches: 35,
        functions: 31,
        lines: 42,
      },
    },
  },
});
