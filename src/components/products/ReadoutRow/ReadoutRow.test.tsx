import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    href,
    children,
    ...rest
  }: {
    href: unknown;
    children: React.ReactNode;
  } & Record<string, unknown>) =>
    React.createElement(
      "a",
      { href: typeof href === "string" ? href : "#", ...rest },
      children,
    ),
  useRouter: () => ({ push: vi.fn() }),
}));

import { ReadoutRow } from "./ReadoutRow";
import { rouProductFixture, makeProduct } from "@/test/fixtures/products";

function renderRow(product = rouProductFixture) {
  return render(
    <table>
      <tbody>
        <ReadoutRow
          product={product}
          imageSrc={null}
          category="specialized"
          locale="en"
        />
      </tbody>
    </table>,
  );
}

describe("ReadoutRow", () => {
  it("renders each slot value from instrumentSpecs", () => {
    const { container } = renderRow();
    expect(
      container.querySelector(".lt-readout-row__cell--display")?.textContent,
    ).toBe("256×64 OLED");
    expect(
      container.querySelector(".lt-readout-row__cell--power")?.textContent,
    ).toBe("220VAC (50–60 Hz)");
    expect(
      container.querySelector(".lt-readout-row__cell--comm")?.textContent,
    ).toBe("RS-232, RS-485");
    expect(
      container.querySelector(".lt-readout-row__cell--conn")?.textContent,
    ).toBe("D-SUB 9-pin");
  });

  it("falls back to em-dash when a slot is missing", () => {
    const product = makeProduct({
      function: "ROU",
      instrumentSpecs: [
        { label: "Display Window", value: "4-Digit", slot: "display" },
        // power, comm, connector intentionally absent
      ],
    });
    const { container } = renderRow(product);
    expect(
      container.querySelector(".lt-readout-row__cell--display")?.textContent,
    ).toBe("4-Digit");
    expect(
      container.querySelector(".lt-readout-row__cell--power")?.textContent,
    ).toBe("—");
    expect(
      container.querySelector(".lt-readout-row__cell--comm")?.textContent,
    ).toBe("—");
    expect(
      container.querySelector(".lt-readout-row__cell--conn")?.textContent,
    ).toBe("—");
  });

  it("ignores instrumentSpecs entries without a slot", () => {
    const product = makeProduct({
      function: "ROU",
      instrumentSpecs: [
        { label: "Output Signal", value: "0–5 Vdc" },
        { label: "Display Window", value: "OLED", slot: "display" },
      ],
    });
    const { container } = renderRow(product);
    expect(
      container.querySelector(".lt-readout-row__cell--display")?.textContent,
    ).toBe("OLED");
    expect(
      container.querySelector(".lt-readout-row__cell--power")?.textContent,
    ).toBe("—");
  });
});
