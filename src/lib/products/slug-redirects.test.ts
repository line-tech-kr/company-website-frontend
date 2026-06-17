import { describe, it, expect } from "vitest";
import nextConfig from "../../../next.config";

describe("next.config redirects (#175)", () => {
  it("emits 3 locale × N renamed-slug redirects, all permanent", async () => {
    const redirects = await nextConfig.redirects?.();
    expect(redirects).toBeDefined();
    expect(redirects!.length).toBeGreaterThan(0);
    expect(redirects!.length % 3).toBe(0);

    for (const r of redirects!) {
      expect(r.permanent).toBe(true);
      expect(r.source.startsWith("/")).toBe(true);
      expect(r.destination.startsWith("/")).toBe(true);
      expect(r.source).not.toBe(r.destination);
      expect(r.source).toMatch(/^\/(ko|en|zh)\/products\//);
      expect(r.destination).toMatch(/^\/(ko|en|zh)\/products\//);
    }
  });

  it("retains the locale prefix between source and destination", async () => {
    const redirects = await nextConfig.redirects?.();
    for (const r of redirects!) {
      const sourceLocale = r.source.split("/")[1];
      const destLocale = r.destination.split("/")[1];
      expect(sourceLocale).toBe(destLocale);
    }
  });

  it("covers the 4 known 2020 → 2026 slug renames in each locale", async () => {
    const redirects = await nextConfig.redirects?.();
    const renames = [
      ["specialized/ex070c", "explosion-proof/ex70c"],
      ["specialized/ex070m", "explosion-proof/ex70m"],
      ["digital/md100c", "digital/md150c"],
      ["digital/md100m", "digital/md150m"],
    ] as const;
    for (const locale of ["ko", "en", "zh"]) {
      for (const [from, to] of renames) {
        const match = redirects!.find(
          (r) =>
            r.source === `/${locale}/products/${from}` &&
            r.destination === `/${locale}/products/${to}`,
        );
        expect(
          match,
          `expected redirect for /${locale}/products/${from} → /${to}`,
        ).toBeTruthy();
      }
    }
  });

  it("redirects the renamed 특수 → 방폭 (specialized → explosion-proof) category in each locale", async () => {
    const redirects = await nextConfig.redirects?.();
    const moves = [
      ["specialized", "explosion-proof"],
      ["specialized/lti-2000", "accessories"],
      ["specialized/do400", "analogue/do400"],
    ] as const;
    for (const locale of ["ko", "en", "zh"]) {
      for (const [from, to] of moves) {
        const match = redirects!.find(
          (r) =>
            r.source === `/${locale}/products/${from}` &&
            r.destination === `/${locale}/products/${to}`,
        );
        expect(
          match,
          `expected redirect for /${locale}/products/${from} → /${to}`,
        ).toBeTruthy();
      }
    }
  });
});
