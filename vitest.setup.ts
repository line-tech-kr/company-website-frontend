import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Stub Sanity env so modules that instantiate the client at import-time don't crash.
// Real network calls are blocked via vi.mock("@/sanity/fetch", ...) in src/test/mocks/sanity.ts.
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??= "test-project";
process.env.NEXT_PUBLIC_SANITY_DATASET ??= "test";
process.env.NEXT_PUBLIC_SITE_URL ??= "https://test.example.com";

// jsdom doesn't implement matchMedia. Components using prefers-reduced-motion
// (e.g. FeatureSection) crash without this stub.
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}
