import { describe, expect, it } from "vitest";
import { formatBytes, formatDate } from "./format";

describe("formatBytes", () => {
  it.each([
    [null],
    [undefined],
    [0],
    [-1],
  ] as const)("renders an em dash for %p", (input) => {
    expect(formatBytes(input)).toBe("—");
  });

  it.each([
    [1, "1 B"],
    [512, "512 B"],
    [1024, "1.0 KB"],
    [1536, "1.5 KB"],
    [1024 * 1024, "1.0 MB"],
    [Math.round(1024 * 1024 * 2.5), "2.5 MB"],
    [1024 * 1024 * 1024, "1.0 GB"],
  ])("formats %i bytes as %s", (input, expected) => {
    expect(formatBytes(input)).toBe(expected);
  });

  it("drops decimals for values >= 100 within a unit", () => {
    expect(formatBytes(150 * 1024)).toBe("150 KB");
  });

  it("caps the unit at GB for values above 1 TB", () => {
    expect(formatBytes(2 * 1024 ** 4)).toBe("2048 GB");
  });
});

describe("formatDate", () => {
  it.each([[null], [undefined], [""]] as const)(
    "renders an empty string for %p",
    (input) => {
      expect(formatDate(input, "en")).toBe("");
    },
  );

  it("returns empty string for an unparseable ISO string", () => {
    expect(formatDate("not-a-date", "en")).toBe("");
  });

  it("formats a YYYY-MM-DD date in English", () => {
    expect(formatDate("2026-05-31", "en")).toMatch(/May 31, 2026/);
  });

  it("formats with Korean locale", () => {
    expect(formatDate("2026-05-31", "ko")).toMatch(/2026/);
  });

  it("formats with Chinese locale", () => {
    expect(formatDate("2026-05-31", "zh")).toMatch(/2026/);
  });

  it("accepts a full ISO timestamp", () => {
    expect(formatDate("2026-05-31T12:00:00Z", "en")).toMatch(/2026/);
  });
});
