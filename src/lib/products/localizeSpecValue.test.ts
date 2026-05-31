import { describe, it, expect } from "vitest";
import { localizeSpecValue } from "./localizeSpecValue";

describe("localizeSpecValue", () => {
  it("passes English values through unchanged", () => {
    expect(localizeSpecValue("<2 seconds", "en")).toBe("<2 seconds");
    expect(localizeSpecValue("0–5 Vdc or 4–20 mA", "en")).toBe(
      "0–5 Vdc or 4–20 mA",
    );
    expect(localizeSpecValue("±1% of FS", "en")).toBe("±1% of FS");
  });

  it("translates English prose words to Korean", () => {
    expect(localizeSpecValue("<2 seconds", "ko")).toBe("<2 초");
    expect(localizeSpecValue("<1 second", "ko")).toBe("<1 초");
    expect(localizeSpecValue("0–5 Vdc or 4–20 mA", "ko")).toBe(
      "0–5 Vdc 또는 4–20 mA",
    );
    expect(localizeSpecValue("±1% of FS", "ko")).toBe("±1% F.S.");
    expect(localizeSpecValue("±1% of fs", "ko")).toBe("±1% F.S.");
    expect(localizeSpecValue("+15 or +24 Vdc, 350 mA", "ko")).toBe(
      "+15 또는 +24 Vdc, 350 mA",
    );
  });

  it("translates English prose words to Chinese", () => {
    expect(localizeSpecValue("<2 seconds", "zh")).toBe("<2 秒");
    expect(localizeSpecValue("0–5 Vdc or 4–20 mA", "zh")).toBe(
      "0–5 Vdc 或 4–20 mA",
    );
    expect(localizeSpecValue("±0.25% of FS", "zh")).toBe("±0.25% F.S.");
  });

  it("leaves pure technical strings untouched in all locales", () => {
    for (const loc of ["en", "ko", "zh"] as const) {
      expect(localizeSpecValue("0.01–100 slpm", loc)).toBe("0.01–100 slpm");
      expect(localizeSpecValue("0–50 °C", loc)).toBe("0–50 °C");
      expect(localizeSpecValue("<90 bar", loc)).toBe("<90 bar");
      expect(localizeSpecValue("1×10⁻⁹ atm·cc/sec", loc)).toBe(
        "1×10⁻⁹ atm·cc/sec",
      );
    }
  });

  it("is idempotent", () => {
    for (const loc of ["ko", "zh"] as const) {
      const once = localizeSpecValue("±1% of FS", loc);
      expect(localizeSpecValue(once, loc)).toBe(once);
      const once2 = localizeSpecValue("<2 seconds", loc);
      expect(localizeSpecValue(once2, loc)).toBe(once2);
    }
  });

  it("localises the `inquiry` sentinel into a contact-us label per locale", () => {
    expect(localizeSpecValue("inquiry", "en")).toBe("Contact us");
    expect(localizeSpecValue("inquiry", "ko")).toBe("문의 바랍니다");
    expect(localizeSpecValue("inquiry", "zh")).toBe("请咨询");
    // Case- and whitespace-insensitive so a fixture typo doesn't reach users.
    expect(localizeSpecValue("Inquiry", "en")).toBe("Contact us");
    expect(localizeSpecValue("  inquiry  ", "zh")).toBe("请咨询");
    // Anchored — doesn't rewrite real bar values that happen to contain the word.
    expect(localizeSpecValue("inquiry only above 100 slpm", "en")).toBe(
      "inquiry only above 100 slpm",
    );
  });
});
