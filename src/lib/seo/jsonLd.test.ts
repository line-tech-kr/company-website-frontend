import { describe, expect, it } from "vitest";
import { safeJsonLd } from "./jsonLd";

describe("safeJsonLd", () => {
  it("round-trips a plain object back through JSON.parse", () => {
    const value = { name: "Line Tech", year: 1997, active: true };
    expect(JSON.parse(safeJsonLd(value))).toEqual(value);
  });

  it("escapes '<' so '</script>' cannot terminate the host tag", () => {
    const out = safeJsonLd({ injection: "</script><script>alert(1)" });
    expect(out).not.toContain("</script>");
    expect(out).not.toContain("<script>");
    expect(out).toContain("\\u003c");
    expect(JSON.parse(out)).toEqual({
      injection: "</script><script>alert(1)",
    });
  });

  it("escapes U+2028 and U+2029 line separators", () => {
    const value = { text: `line1 line2 line3` };
    const out = safeJsonLd(value);
    expect(out).not.toContain(" ");
    expect(out).not.toContain(" ");
    expect(out).toContain("\\u2028");
    expect(out).toContain("\\u2029");
    expect(JSON.parse(out)).toEqual(value);
  });

  it("preserves regular quotes inside string values", () => {
    const out = safeJsonLd({ note: 'He said "hi".' });
    expect(JSON.parse(out)).toEqual({ note: 'He said "hi".' });
  });
});
