import { vi, type Mock } from "vitest";

type JsonInit = Record<string, unknown> | unknown[];

const original = globalThis.fetch;

export function stubFetchJson(body: JsonInit): Mock {
  const mock = vi.fn().mockResolvedValue({
    json: () => Promise.resolve(body),
  });
  globalThis.fetch = mock as unknown as typeof fetch;
  return mock;
}

export function stubFetchReject(err: unknown): Mock {
  const mock = vi.fn().mockRejectedValue(err);
  globalThis.fetch = mock as unknown as typeof fetch;
  return mock;
}

export function restoreFetch(): void {
  globalThis.fetch = original;
}
