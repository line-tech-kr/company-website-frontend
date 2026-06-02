import { describe, expect, it } from "vitest";
import { pickLocalized } from "./pickLocalized";

describe("pickLocalized", () => {
  it("returns the locale-specific value when set", () => {
    expect(
      pickLocalized({ ko: "특허", en: "Patent", zh: "专利" }, "ko", "fallback"),
    ).toBe("특허");
    expect(
      pickLocalized({ ko: "특허", en: "Patent", zh: "专利" }, "en", "fallback"),
    ).toBe("Patent");
  });

  it("falls back when the locale slot is missing", () => {
    expect(pickLocalized({ en: "Patent" }, "ko", "Patent KR 10-2759236")).toBe(
      "Patent KR 10-2759236",
    );
  });

  it("falls back when the locale slot is null", () => {
    expect(
      pickLocalized({ ko: null, en: "Patent", zh: null }, "ko", "fallback"),
    ).toBe("fallback");
  });

  it("treats whitespace-only as empty so editors can blank a field cleanly", () => {
    expect(pickLocalized({ ko: "   " }, "ko", "fallback")).toBe("fallback");
  });

  it("trims surrounding whitespace from the returned value", () => {
    expect(pickLocalized({ ko: "  특허  " }, "ko", "fallback")).toBe("특허");
  });

  it("falls back when the field is null or undefined", () => {
    expect(pickLocalized(null, "ko", "fallback")).toBe("fallback");
    expect(pickLocalized(undefined, "ko", "fallback")).toBe("fallback");
  });
});
