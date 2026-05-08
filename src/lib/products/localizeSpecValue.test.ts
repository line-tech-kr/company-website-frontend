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
});
