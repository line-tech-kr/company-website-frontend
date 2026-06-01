import { describe, expect, it } from "vitest";
import { formatISODate, formatShortDate, formatYearMonth } from "./dates";

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

  it.each([[null], [undefined]] as const)(
    "returns an empty string for %p",
    (input) => {
      expect(formatISODate(input, "en")).toBe("");
    },
  );

  it("preserves the date for a YYYY-MM-DD value regardless of timezone", () => {
    // Normalizes to local-midnight, so a date-only ISO string never shifts.
    expect(formatISODate("2026-05-31", "en")).toMatch(/May 31, 2026/);
  });

  it("accepts a full ISO timestamp", () => {
    expect(formatISODate("2026-05-31T12:00:00Z", "en")).toMatch(/2026/);
  });
});

describe("formatShortDate", () => {
  it("formats with short month by default", () => {
    expect(formatShortDate("2026-03-15", "en")).toMatch(/Mar 15, 2026/);
  });

  it("returns an empty string for null", () => {
    expect(formatShortDate(null, "en")).toBe("");
  });

  it("returns an empty string for an unparseable ISO string", () => {
    expect(formatShortDate("not-a-date", "en")).toBe("");
  });
});
