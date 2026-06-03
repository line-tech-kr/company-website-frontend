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
  return render(
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
}

describe("DimensionDrawing", () => {
  it("renders one row per callout", () => {
    const { container } = renderDrawing();
    const rows = container.querySelectorAll(".lt-pdp-dim__row");
    expect(rows).toHaveLength(5);
  });

  it("starts with no active row", () => {
    const { container } = renderDrawing();
    expect(container.querySelector(".lt-pdp-dim__row.is-active")).toBeNull();
  });

  it("mouseEnter on a callout row adds is-active to that row only", () => {
    const { container } = renderDrawing();
    const rows = container.querySelectorAll(".lt-pdp-dim__row");
    const rowB = rows[1] as HTMLElement;

    fireEvent.mouseEnter(rowB);
    expect(rowB).toHaveClass("is-active");

    const active = container.querySelectorAll(".lt-pdp-dim__row.is-active");
    expect(active).toHaveLength(1);
  });

  it("mouseLeave clears the active state", () => {
    const { container } = renderDrawing();
    const rows = container.querySelectorAll(".lt-pdp-dim__row");
    const rowB = rows[1] as HTMLElement;

    fireEvent.mouseEnter(rowB);
    expect(rowB).toHaveClass("is-active");

    fireEvent.mouseLeave(rowB);
    expect(rowB).not.toHaveClass("is-active");
  });

  it("hovering a different row transfers the active class", () => {
    const { container } = renderDrawing();
    const rows = container.querySelectorAll(".lt-pdp-dim__row");
    const rowA = rows[0] as HTMLElement;
    const rowC = rows[2] as HTMLElement;

    fireEvent.mouseEnter(rowA);
    expect(rowA).toHaveClass("is-active");

    fireEvent.mouseEnter(rowC);
    expect(rowC).toHaveClass("is-active");
    expect(rowA).not.toHaveClass("is-active");
  });
});
