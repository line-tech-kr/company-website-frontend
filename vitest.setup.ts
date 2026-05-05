import "@testing-library/jest-dom/vitest";

// Stub Sanity env so modules that instantiate the client at import-time don't crash.
// Real network calls are blocked via vi.mock("@/sanity/fetch", ...) in src/test/mocks/sanity.ts.
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??= "test-project";
process.env.NEXT_PUBLIC_SANITY_DATASET ??= "test";
process.env.NEXT_PUBLIC_SITE_URL ??= "https://test.example.com";
