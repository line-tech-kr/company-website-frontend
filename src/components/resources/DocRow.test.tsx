import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";

import { DocRow } from "./DocRow";

function renderRow(props: Partial<React.ComponentProps<typeof DocRow>> = {}) {
  return render(
    <ul>
      <DocRow label="Doc" action={<a href="#">Download</a>} {...props} />
    </ul>,
  );
}

describe("DocRow", () => {
  it("defaults the file-type badge to PDF", () => {
    const { getByText } = renderRow();
    expect(getByText("PDF")).toBeInTheDocument();
  });

  it("renders a custom badge (e.g. ZIP for software archives)", () => {
    const { getByText, queryByText } = renderRow({ badge: "ZIP" });
    expect(getByText("ZIP")).toBeInTheDocument();
    expect(queryByText("PDF")).toBeNull();
  });

  it("drops falsy meta parts and separates the rest with ·", () => {
    const { getByText, container } = renderRow({
      meta: ["M3030VA", null, "v1.0", undefined],
    });
    expect(getByText("M3030VA")).toBeInTheDocument();
    expect(getByText("v1.0")).toBeInTheDocument();
    expect(container.querySelectorAll(".dr-list__sep")).toHaveLength(1);
  });
});
