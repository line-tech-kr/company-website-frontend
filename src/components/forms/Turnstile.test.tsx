import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";

// Renders as a <div> so RTL queries can find it — getByTestId skips <script>.
vi.mock("next/script", () => ({
  default: (props: Record<string, unknown>) =>
    React.createElement("div", { ...props, "data-testid": "next-script" }),
}));

import { Turnstile } from "./Turnstile";

describe("Turnstile", () => {
  it("returns null when siteKey is empty", () => {
    const { container } = render(<Turnstile siteKey="" />);
    expect(container.firstChild).toBeNull();
  });

  it("renders the widget div and the Cloudflare script when siteKey is provided", () => {
    const { container, getByTestId } = render(<Turnstile siteKey="0x4AAA" />);

    const widget = container.querySelector(".cf-turnstile");
    expect(widget).not.toBeNull();
    expect(widget).toHaveAttribute("data-sitekey", "0x4AAA");

    const script = getByTestId("next-script");
    expect(script).toHaveAttribute(
      "src",
      "https://challenges.cloudflare.com/turnstile/v0/api.js",
    );
    expect(script).toHaveAttribute("strategy", "afterInteractive");
  });
});
