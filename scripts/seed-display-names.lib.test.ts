import { describe, expect, it } from "vitest";
import { derive, hasAnyValue, localizedArray } from "./seed-display-names.lib";

describe("derive — manual", () => {
  it("strips ' Manual' suffix and substitutes per locale", () => {
    expect(derive("manual", "M2030 Manual")).toEqual({
      ko: "M2030 매뉴얼",
      en: "M2030 Manual",
      zh: "M2030 手册",
    });
  });

  it("matches the optional 'User ' prefix in the suffix", () => {
    expect(derive("manual", "PED20 User Manual")).toEqual({
      ko: "PED20 매뉴얼",
      en: "PED20 User Manual",
      zh: "PED20 手册",
    });
  });

  it("returns null when the title doesn't end with the expected word", () => {
    expect(derive("manual", "MS3150 Series")).toBeNull();
  });

  it("returns null when stripping the suffix leaves an empty stem", () => {
    expect(derive("manual", "Manual")).toBeNull();
  });
});

describe("derive — datasheet & drawing", () => {
  it("substitutes datasheet word", () => {
    expect(derive("datasheet", "DO400 Datasheet")).toEqual({
      ko: "DO400 데이터시트",
      en: "DO400 Datasheet",
      zh: "DO400 数据表",
    });
  });

  it("substitutes drawing word", () => {
    expect(derive("drawing", "MS2030VA Dimensional Drawing")).toEqual({
      ko: "MS2030VA Dimensional 도면",
      en: "MS2030VA Dimensional Drawing",
      zh: "MS2030VA Dimensional 图纸",
    });
  });

  it("returns null when drawing title has no trailing 'Drawing'", () => {
    expect(derive("drawing", "M2030VA CAD package")).toBeNull();
  });
});

describe("derive — certification", () => {
  it("substitutes 'Patent KR' → '특허 KR' / '专利 KR'", () => {
    expect(derive("certification", "Patent KR 10-2759236")).toEqual({
      ko: "특허 KR 10-2759236",
      en: "Patent KR 10-2759236",
      zh: "专利 KR 10-2759236",
    });
  });

  it("returns null for non-matching cert names so editors fill them by hand", () => {
    expect(derive("certification", "ISO 9001")).toBeNull();
    expect(derive("certification", "CE")).toBeNull();
    expect(
      derive("certification", "Corporate R&D Center Recognition"),
    ).toBeNull();
  });
});

describe("hasAnyValue", () => {
  it("returns false for null / undefined / empty", () => {
    expect(hasAnyValue(null)).toBe(false);
    expect(hasAnyValue(undefined)).toBe(false);
    expect(hasAnyValue([])).toBe(false);
  });

  it("returns false when every entry is missing a value or whitespace-only", () => {
    expect(
      hasAnyValue([
        { language: "ko" },
        { language: "en", value: "" },
        { language: "zh", value: "   " },
      ]),
    ).toBe(false);
  });

  it("returns true if any entry has a non-empty trimmed value", () => {
    expect(
      hasAnyValue([
        { language: "ko", value: "" },
        { language: "en", value: "Patent KR 10-1" },
      ]),
    ).toBe(true);
  });
});

describe("localizedArray", () => {
  it("emits the internationalizedArrayString row shape Sanity expects", () => {
    expect(localizedArray({ ko: "특허", en: "Patent", zh: "专利" })).toEqual([
      { _key: "ko", language: "ko", value: "특허" },
      { _key: "en", language: "en", value: "Patent" },
      { _key: "zh", language: "zh", value: "专利" },
    ]);
  });
});
