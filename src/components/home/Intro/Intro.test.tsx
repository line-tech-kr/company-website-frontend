import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";

// Button renders a locale-aware next-intl <Link>; stub it to a plain anchor so
// Intro renders without an i18n provider.
vi.mock("@/i18n/navigation", () => ({
  Link: (props: Record<string, unknown>) => React.createElement("a", props),
}));

import { Intro } from "./Intro";
import { LT_HOME } from "@/lib/content/home";

describe("Intro", () => {
  it("passes each locale's videoLabel through to the hero video", () => {
    for (const locale of ["ko", "en", "zh"] as const) {
      const { container, unmount } = render(<Intro h={LT_HOME[locale]} />);
      const video = container.querySelector("video");
      expect(video).toHaveAttribute(
        "aria-label",
        LT_HOME[locale].intro.videoLabel,
      );
      unmount();
    }
  });
});
