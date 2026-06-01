import { vi, type Mock } from "vitest";

export function makeHeadersMock(): Mock {
  return vi.fn();
}

export function mockNextHeaders(mock: Mock, map: Record<string, string>): void {
  mock.mockResolvedValue({
    get: (name: string) => map[name.toLowerCase()] ?? null,
  });
}
