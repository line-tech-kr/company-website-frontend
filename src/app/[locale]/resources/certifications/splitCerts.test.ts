import { describe, it, expect } from "vitest";
import { splitCerts } from "./splitCerts";

const cert = (id: string, models?: string[] | null) => ({ id, models });

describe("splitCerts", () => {
  it("treats undefined models as company-wide", () => {
    const { companyWide, productSpecific } = splitCerts([cert("iso-9001")]);
    expect(companyWide).toHaveLength(1);
    expect(productSpecific).toHaveLength(0);
  });

  it("treats null models as company-wide", () => {
    const { companyWide, productSpecific } = splitCerts([cert("ce", null)]);
    expect(companyWide).toHaveLength(1);
    expect(productSpecific).toHaveLength(0);
  });

  it("treats empty models[] as company-wide", () => {
    const { companyWide, productSpecific } = splitCerts([cert("innobiz", [])]);
    expect(companyWide).toHaveLength(1);
    expect(productSpecific).toHaveLength(0);
  });

  it("puts populated models into product-specific", () => {
    const { companyWide, productSpecific } = splitCerts([
      cert("ce-doc-ms3150va", ["MS3150VA"]),
    ]);
    expect(companyWide).toHaveLength(0);
    expect(productSpecific).toHaveLength(1);
  });

  it("preserves order within each bucket", () => {
    const input = [
      cert("a"),
      cert("b", ["EX70C"]),
      cert("c"),
      cert("d", ["LTI-1000", "LTI-2000"]),
      cert("e", []),
    ];
    const { companyWide, productSpecific } = splitCerts(input);
    expect(companyWide.map((c) => c.id)).toEqual(["a", "c", "e"]);
    expect(productSpecific.map((c) => c.id)).toEqual(["b", "d"]);
  });
});
