import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { IntroVideo } from "./IntroVideo";

const LABEL = "Product overview video";

describe("IntroVideo", () => {
  it("renders a click-to-play promo with poster and deferred loading", () => {
    const { container } = render(<IntroVideo label={LABEL} />);
    const video = container.querySelector("video");

    expect(video).not.toBeNull();
    expect(video).toHaveAttribute("controls");
    expect(video).toHaveAttribute("preload", "none");
    expect(video).toHaveAttribute("poster", "/home/promo-poster.jpg");
    expect(video).toHaveAttribute("aria-label", LABEL);
    expect(video?.getAttribute("src")).toMatch(
      /^https:\/\/cdn\.sanity\.io\/files\/.+\.mp4$/,
    );
    // No autoplay — narration should not play silently on load.
    expect(video).not.toHaveAttribute("autoplay");
  });
});
