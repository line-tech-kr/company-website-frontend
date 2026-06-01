import { describe, expect, it } from "vitest";
import { formatISODate, formatYearMonth } from "./dates";

describe("formatYearMonth", () => {
  it("formats a YYYY.MM string with the English long-month locale", () => {
    expect(formatYearMonth("2020.03", "en")).toBe("March 2020");
  });

  it("formats a YYYY.MM string with the Korean locale", () => {
    const out = formatYearMonth("1997.06", "ko");
    expect(out).toContain("1997");
    expect(out).toContain("6월");
  });

  it("formats a YYYY.MM string with the Chinese locale", () => {
    const out = formatYearMonth("2026.05", "zh");
    expect(out).toContain("2026");
    expect(out).toMatch(/5月|五月/);
  });
});

describe("formatISODate", () => {
  it("formats an ISO date with default long-form options", () => {
    expect(formatISODate("2026-05-31", "en")).toMatch(/May 31, 2026/);
  });

  it("respects caller-supplied Intl options", () => {
    expect(
      formatISODate("2026-05-31", "en", { year: "numeric", month: "short" }),
    ).toMatch(/May 2026/);
  });

  it("returns an empty string when the input is unparseable", () => {
    expect(formatISODate("not-a-date", "en")).toBe("");
  });

  it("returns an empty string when the input is empty", () => {
    expect(formatISODate("", "en")).toBe("");
  });
});
