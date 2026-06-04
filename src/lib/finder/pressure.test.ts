import { describe, expect, it } from "vitest";
import { catalogValueToBar, toBar } from "./pressure";

describe("toBar", () => {
  it("passes bar through", () => {
    expect(toBar(2, "bar")).toBe(2);
  });
  it("converts kPa to bar", () => {
    expect(toBar(200, "kPa")).toBeCloseTo(2, 6);
  });
  it("converts MPa to bar", () => {
    expect(toBar(0.5, "MPa")).toBeCloseTo(5, 6);
  });
  it("converts psi to bar", () => {
    expect(toBar(14.5038, "psi")).toBeCloseTo(1, 3);
  });
});

describe("catalogValueToBar", () => {
  it("treats barA/barG as bar", () => {
    expect(catalogValueToBar(2, "barA")).toBe(2);
    expect(catalogValueToBar(2, "barG")).toBe(2);
  });
  it("converts MPa values from catalogue", () => {
    expect(catalogValueToBar(0.5, "MPa")).toBeCloseTo(5, 6);
  });
  it("returns null on unknown unit", () => {
    expect(catalogValueToBar(1, "atm")).toBeNull();
  });
  it("defaults to bar when unit is missing", () => {
    expect(catalogValueToBar(3, undefined)).toBe(3);
  });
});
