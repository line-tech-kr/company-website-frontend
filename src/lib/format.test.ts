import { describe, expect, it } from "vitest";
import { formatBytes } from "./format";

describe("formatBytes", () => {
  it.each([[null], [undefined], [0], [-1]] as const)(
    "renders an em dash for %p",
    (input) => {
      expect(formatBytes(input)).toBe("—");
    },
  );

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
