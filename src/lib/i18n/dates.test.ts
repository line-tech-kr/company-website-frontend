import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { formatLongDate, formatShortDate, formatYearMonth } from "./dates";

// Force a west-of-UTC timezone so the local-midnight normalization is
// actually exercised. Without this, a date-only ISO string like
// "2026-05-31" would render correctly even with the OLD (UTC-parsing)
// implementation on any CI runner in UTC or east of UTC — making the
// regression invisible.
const ORIGINAL_TZ = process.env.TZ;
beforeAll(() => {
  process.env.TZ = "America/Los_Angeles";
});
afterAll(() => {
  process.env.TZ = ORIGINAL_TZ;
});

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

describe("formatLongDate", () => {
  it("formats an ISO date with default long-form options", () => {
    expect(formatLongDate("2026-05-31", "en")).toMatch(/May 31, 2026/);
  });

  it("respects caller-supplied Intl options", () => {
    expect(
      formatLongDate("2026-05-31", "en", { year: "numeric", month: "short" }),
    ).toMatch(/May 2026/);
  });

  it("returns an empty string when the input is unparseable", () => {
    expect(formatLongDate("not-a-date", "en")).toBe("");
  });

  it("returns an empty string when the input is empty", () => {
    expect(formatLongDate("", "en")).toBe("");
  });

  it.each([[null], [undefined]] as const)(
    "returns an empty string for %p",
    (input) => {
      expect(formatLongDate(input, "en")).toBe("");
    },
  );

  it("preserves the calendar day in a negative-offset timezone", () => {
    // Suite forces TZ to America/Los_Angeles (UTC-7 or UTC-8). Without
    // local-midnight normalization, "2026-05-31" would parse as
    // 2026-05-31T00:00:00Z and render as "May 30, 2026" in LA — that's
    // the timezone-shift bug. The day must stay May 31.
    expect(formatLongDate("2026-05-31", "en")).toMatch(/May 31, 2026/);
    expect(formatLongDate("2026-05-31", "en")).not.toMatch(/May 30/);
  });

  it("accepts a full ISO timestamp", () => {
    expect(formatLongDate("2026-05-31T12:00:00Z", "en")).toMatch(/2026/);
  });
});

describe("formatShortDate", () => {
  it("formats with short month by default (en)", () => {
    expect(formatShortDate("2026-03-15", "en")).toMatch(/Mar 15, 2026/);
  });

  it("formats with the Korean locale", () => {
    const out = formatShortDate("2026-03-15", "ko");
    expect(out).toContain("2026");
    expect(out).toContain("3월");
  });

  it("formats with the Chinese locale", () => {
    const out = formatShortDate("2026-03-15", "zh");
    expect(out).toContain("2026");
    expect(out).toMatch(/3月|三月/);
  });

  it("returns an empty string for null", () => {
    expect(formatShortDate(null, "en")).toBe("");
  });

  it("returns an empty string for an unparseable ISO string", () => {
    expect(formatShortDate("not-a-date", "en")).toBe("");
  });
});
