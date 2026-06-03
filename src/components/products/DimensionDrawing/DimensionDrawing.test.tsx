import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { DimensionDrawing, type Callout } from "./DimensionDrawing";

const CALLOUTS: Callout[] = [
  { id: "A", label: "Body length", value: "97 mm" },
  { id: "B", label: "Body width", value: "32 mm" },
  { id: "C", label: "Mounting pitch", value: "84 mm" },
  { id: "D", label: "Connector offset", value: "12 mm" },
  { id: "E", label: "Inlet height", value: "26 mm" },
];

function renderDrawing() {
  const utils = render(
    <DimensionDrawing
      kicker="Dimensions"
      heading="Outline"
      sub="Reference dimensions"
      caption="All dimensions in mm."
      note="Tolerances per ISO 2768."
      drawingNumber="DWG-001"
      callouts={CALLOUTS}
      calloutsAriaLabel="Callouts"
    />,
  );
  const rows =
    utils.container.querySelectorAll<HTMLElement>(".lt-pdp-dim__row");
  const cdots =
    utils.container.querySelectorAll<SVGGElement>(".lt-pdp-dim__cdot");
  return { ...utils, rows, cdots };
}

describe("DimensionDrawing", () => {
  it("renders one row per callout", () => {
    const { rows } = renderDrawing();
    expect(rows).toHaveLength(5);
  });

  it("starts with no active row", () => {
    const { container } = renderDrawing();
    expect(container.querySelector(".lt-pdp-dim__row.is-active")).toBeNull();
  });

  it("mouseEnter on a callout row adds is-active to that row only", () => {
    const { container, rows } = renderDrawing();
    fireEvent.mouseEnter(rows[1]);
    expect(rows[1]).toHaveClass("is-active");
    expect(
      container.querySelectorAll(".lt-pdp-dim__row.is-active"),
    ).toHaveLength(1);
  });

  it("mouseLeave clears the active state", () => {
    const { rows } = renderDrawing();
    fireEvent.mouseEnter(rows[1]);
    expect(rows[1]).toHaveClass("is-active");
    fireEvent.mouseLeave(rows[1]);
    expect(rows[1]).not.toHaveClass("is-active");
  });

  it("hovering a different row transfers the active class", () => {
    const { rows } = renderDrawing();
    fireEvent.mouseEnter(rows[0]);
    expect(rows[0]).toHaveClass("is-active");

    fireEvent.mouseEnter(rows[2]);
    expect(rows[2]).toHaveClass("is-active");
    expect(rows[0]).not.toHaveClass("is-active");
  });

  it("hovering an SVG callout dot activates the matching legend row", () => {
    // The SVG callout dots and the legend rows share `hover` state via the
    // setH callback factory in the parent. Hovering callout B in the SVG
    // should highlight the B row in the legend.
    const { rows, cdots } = renderDrawing();
    expect(cdots).toHaveLength(5);

    fireEvent.mouseEnter(cdots[1]);
    expect(rows[1]).toHaveClass("is-active");

    fireEvent.mouseLeave(cdots[1]);
    expect(rows[1]).not.toHaveClass("is-active");
  });
});
