import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { MarketsMap, type MarketDestination } from "./MarketsMap";

const HQ = { iso: "KR", lat: 36.35, lon: 127.38 };
const DESTINATIONS: ReadonlyArray<MarketDestination> = [
  { iso: "JP", lat: 35.7, lon: 139.7 },
  { iso: "US", lat: 39.0, lon: -98.0 },
  { iso: "DE", lat: 52.5, lon: 13.4 },
];
const NAMES: Record<string, string> = {
  KR: "Korea",
  JP: "Japan",
  US: "United States",
  DE: "Germany",
};

function renderMap() {
  return render(
    <MarketsMap
      hq={HQ}
      destinations={DESTINATIONS}
      countryNames={NAMES}
      ariaLabel="Export markets"
    />,
  );
}

describe("MarketsMap", () => {
  it("renders one path per country in the dataset", () => {
    const { container } = renderMap();
    const paths = container.querySelectorAll("path[data-iso]");
    // Bundle currently ships 175 countries; assert >= 150 so dataset
    // refreshes don't break the test on a count drift.
    expect(paths.length).toBeGreaterThan(150);
  });

  it("highlights HQ and every destination", () => {
    const { container } = renderMap();
    const selected = container.querySelectorAll("path[data-iso].is-selected");
    const isos = Array.from(selected).map((el) => el.getAttribute("data-iso"));
    expect(isos).toContain("KR");
    expect(isos).toContain("JP");
    expect(isos).toContain("US");
    expect(isos).toContain("DE");
    expect(selected.length).toBe(DESTINATIONS.length + 1);
  });

  it("does not highlight unrelated countries", () => {
    const { container } = renderMap();
    const fr = container.querySelector('path[data-iso="FR"]');
    expect(fr).not.toBeNull();
    expect(fr?.classList.contains("is-selected")).toBe(false);
  });

  it("renders one arc per destination, none for HQ itself", () => {
    const { container } = renderMap();
    const arcs = container.querySelectorAll(".co-markets__arc");
    expect(arcs.length).toBe(DESTINATIONS.length);
  });

  it("renders a destination marker per destination", () => {
    const { container } = renderMap();
    const dots = container.querySelectorAll(".co-markets__dot");
    expect(dots.length).toBe(DESTINATIONS.length);
  });

  it("renders a single HQ marker", () => {
    const { container } = renderMap();
    expect(container.querySelectorAll(".co-markets__hqDot").length).toBe(1);
  });

  it("attaches a localized <title> to selected countries with names", () => {
    const { container } = renderMap();
    const jp = container.querySelector('path[data-iso="JP"]');
    expect(jp?.querySelector("title")?.textContent).toBe("Japan");
  });

  it("omits <title> on selected countries without a name entry", () => {
    const { container } = render(
      <MarketsMap
        hq={HQ}
        destinations={DESTINATIONS}
        countryNames={{ KR: "Korea" /* JP/US/DE intentionally absent */ }}
        ariaLabel="Export markets"
      />,
    );
    const jp = container.querySelector('path[data-iso="JP"]');
    expect(jp?.querySelector("title")).toBeNull();
  });

  it("exposes a localized aria-label on the root <svg>", () => {
    const { container } = renderMap();
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("aria-label")).toBe("Export markets");
  });
});
