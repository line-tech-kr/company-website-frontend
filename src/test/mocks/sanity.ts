import { vi } from "vitest";

// Importing anything from this file registers a vi.mock for @/sanity/fetch.
// Use mockFetchSanity({ "<ctx.name>": () => fixture }) inside beforeEach (or per-test)
// to set up handlers. Unmocked names throw so missing setup fails loudly.

const handlers = new Map<string, () => unknown>();

vi.mock("@/sanity/fetch", () => ({
  fetchSanity: async <T>(
    _query: () => Promise<T>,
    ctx: { name: string; params?: Record<string, unknown> },
  ): Promise<T> => {
    const handler = handlers.get(ctx.name);
    if (!handler) {
      throw new Error(
        `[mockFetchSanity] no handler registered for "${ctx.name}". ` +
          `Add one with mockFetchSanity({ "${ctx.name}": () => fixture }).`,
      );
    }
    return handler() as T;
  },
}));

export function mockFetchSanity(
  handlersByName: Record<string, () => unknown>,
): void {
  handlers.clear();
  for (const [name, handler] of Object.entries(handlersByName)) {
    handlers.set(name, handler);
  }
}

export function clearMockFetchSanity(): void {
  handlers.clear();
}
