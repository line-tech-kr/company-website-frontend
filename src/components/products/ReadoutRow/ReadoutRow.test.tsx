import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";

const pushSpy = vi.fn();

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
  useRouter: () => ({ push: pushSpy }),
}));

import { ReadoutRow } from "./ReadoutRow";
import { rouProductFixture, makeProduct } from "@/test/fixtures/products";
import type { Product } from "@/lib/types/product";

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
  beforeEach(() => {
    pushSpy.mockReset();
  });

  it("renders each slot value from instrumentSpecs", () => {
    const { container } = renderRow();
    expect(
      container.querySelector(".lt-readout-row__cell--display")?.textContent,
    ).toBe("256×64 OLED");
    expect(
      container.querySelector(".lt-readout-row__cell--power")?.textContent,
    ).toBe("220VAC (50–60 Hz)");
    expect(
      container.querySelector(".lt-readout-row__cell--communication")
        ?.textContent,
    ).toBe("RS-232, RS-485");
    expect(
      container.querySelector(".lt-readout-row__cell--connector")?.textContent,
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
      container.querySelector(".lt-readout-row__cell--communication")
        ?.textContent,
    ).toBe("—");
    expect(
      container.querySelector(".lt-readout-row__cell--connector")?.textContent,
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

  describe("navigation", () => {
    it("pushes to the product href when a plain cell is clicked", () => {
      const { container } = renderRow();
      const row = container.querySelector(".lt-readout-row") as HTMLElement;
      const cell = row.querySelector(
        ".lt-readout-row__cell--display",
      ) as HTMLElement;
      fireEvent.click(cell);
      expect(pushSpy).toHaveBeenCalledWith("/products/specialized/rou-test");
    });

    it("does not navigate when a modifier key is held", () => {
      const { container } = renderRow();
      const row = container.querySelector(".lt-readout-row") as HTMLElement;
      fireEvent.click(row, { metaKey: true });
      fireEvent.click(row, { ctrlKey: true });
      fireEvent.click(row, { shiftKey: true });
      fireEvent.click(row, { altKey: true });
      expect(pushSpy).not.toHaveBeenCalled();
    });

    it("does not navigate when an inner anchor is clicked", () => {
      const { container } = renderRow();
      const link = container.querySelector(
        ".lt-prod-row__codelink",
      ) as HTMLElement;
      fireEvent.click(link);
      expect(pushSpy).not.toHaveBeenCalled();
    });

    it("navigates on Enter and Space key presses", () => {
      const { container } = renderRow();
      const row = container.querySelector(".lt-readout-row") as HTMLElement;
      fireEvent.keyDown(row, { key: "Enter" });
      fireEvent.keyDown(row, { key: " " });
      expect(pushSpy).toHaveBeenCalledTimes(2);
      expect(pushSpy).toHaveBeenNthCalledWith(
        1,
        "/products/specialized/rou-test",
      );
    });
  });

  describe("description cell", () => {
    it("renders chips for visible tag kinds, capped at three", () => {
      const tags: Product["tags"] = [
        {
          slug: { current: "high-flow" },
          kind: "capability",
          label: { ko: "고유량", en: "High flow", zh: "大流量" },
        },
        {
          slug: { current: "n2" },
          kind: "gas",
          label: { ko: "질소", en: "N2", zh: "氮气" },
        },
        {
          slug: { current: "semicon" },
          kind: "application",
          label: { ko: "반도체", en: "Semicon", zh: "半导体" },
        },
        {
          slug: { current: "fast-response" },
          kind: "capability",
          label: { ko: "빠른응답", en: "Fast response", zh: "快速响应" },
        },
        {
          slug: { current: "ar" },
          kind: "gas",
          label: { ko: "아르곤", en: "Ar", zh: "氩气" },
        },
      ];
      const product = makeProduct({
        function: "ROU",
        tags,
        instrumentSpecs: rouProductFixture.instrumentSpecs,
      });
      const { container, queryByText } = renderRow(product);

      const chips = container.querySelectorAll(".lt-prod-row__tags > *");
      expect(chips.length).toBe(3);
      // Non-allowed kind (application) is filtered out
      expect(queryByText("Semicon")).toBeNull();
      // The raw description label is hidden in favor of chips
      expect(container.querySelector(".lt-prod-row__label")).toBeNull();
    });

    it("falls back to description label when no visible tags are present", () => {
      const product = makeProduct({
        function: "ROU",
        tags: [
          {
            slug: { current: "semicon" },
            kind: "application",
            label: { ko: "반도체", en: "Semicon", zh: "半导体" },
          },
        ],
        description: {
          ko: "리드아웃",
          en: "Read-out unit",
          zh: "读数单元",
        },
        instrumentSpecs: rouProductFixture.instrumentSpecs,
      });
      const { container, getByText } = renderRow(product);

      expect(container.querySelector(".lt-prod-row__tags")).toBeNull();
      expect(getByText("Read-out unit")).toBeTruthy();
    });
  });
});
