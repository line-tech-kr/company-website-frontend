import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import {
  installIntersectionObserver,
  type IOHarness,
} from "@/test/helpers/intersectionObserver";
import { AccessoriesSideNav } from "./AccessoriesSideNav";
import type { AccessoriesNavNode } from "@/lib/content/accessories";

const NAV: AccessoriesNavNode[] = [
  {
    id: "readouts",
    label: "Read-out units",
    href: "#readouts",
    children: [
      { id: "lti-200", label: "LTI-200", href: "#lti-200" },
      { id: "lti-1000", label: "LTI-1000", href: "#lti-1000" },
    ],
  },
  {
    id: "pressure-accessories",
    label: "Pressure accessories",
    href: "#pressure-accessories",
  },
];

const SECTION_IDS = ["readouts", "lti-200", "lti-1000", "pressure-accessories"];

function stageSectionTargets() {
  for (const id of SECTION_IDS) {
    const el = document.createElement("section");
    el.id = id;
    document.body.appendChild(el);
  }
}

function renderNav() {
  return render(<AccessoriesSideNav heading="On this page" items={NAV} />);
}

let io: IOHarness;

beforeEach(() => {
  // useScrollSpy's isNearBottom() trips immediately in jsdom (default
  // documentElement.scrollHeight is 0). Stage a tall page so the observer
  // callback isn't short-circuited.
  Object.defineProperty(document.documentElement, "scrollHeight", {
    configurable: true,
    value: 5000,
  });
  io = installIntersectionObserver();
});

afterEach(() => {
  document.body.innerHTML = "";
});

describe("AccessoriesSideNav", () => {
  it("renders the heading and one link per node (including children)", () => {
    const { container } = renderNav();
    expect(container.querySelector(".acc-aside__heading")).toHaveTextContent(
      "On this page",
    );
    expect(container.querySelectorAll(".acc-nav__link")).toHaveLength(2);
    expect(container.querySelectorAll(".acc-nav__sublink")).toHaveLength(2);
  });

  it("does not render a sublist for nodes without children", () => {
    const { container } = renderNav();
    // Only `readouts` has children; `pressure-accessories` should not get a sublist.
    expect(container.querySelectorAll(".acc-nav__sublist")).toHaveLength(1);
  });

  it("marks the first section as current on initial render", () => {
    const { container } = renderNav();
    const links = container.querySelectorAll(".acc-nav__link");
    expect(links[0]).toHaveClass("is-current");
    expect(links[0]).toHaveAttribute("aria-current", "true");
    expect(links[1]).not.toHaveClass("is-current");
  });

  it("intersecting a child id promotes that child to current and clears the parent", () => {
    stageSectionTargets();
    const { container } = renderNav();

    act(() => {
      io.fire([{ id: "lti-200", isIntersecting: true }]);
    });

    const sublinks = container.querySelectorAll(".acc-nav__sublink");
    expect(sublinks[0]).toHaveClass("is-current");
    expect(sublinks[0]).toHaveAttribute("aria-current", "true");
    expect(sublinks[1]).not.toHaveClass("is-current");

    const links = container.querySelectorAll(".acc-nav__link");
    expect(links[0]).not.toHaveClass("is-current");
  });

  it("intersecting a second top-level section transfers current to it", () => {
    stageSectionTargets();
    const { container } = renderNav();

    act(() => {
      io.fire([{ id: "pressure-accessories", isIntersecting: true }]);
    });

    const links = container.querySelectorAll(".acc-nav__link");
    expect(links[1]).toHaveClass("is-current");
    expect(links[1]).toHaveAttribute("aria-current", "true");
    expect(links[0]).not.toHaveClass("is-current");
  });

  it("when multiple ids intersect at once, the first one in flatten order wins", () => {
    // `ids.find((id) => intersecting.has(id))` walks flatten order, so the
    // parent section (readouts) should beat a simultaneously-intersecting child.
    stageSectionTargets();
    const { container } = renderNav();

    act(() => {
      io.fire([
        { id: "lti-200", isIntersecting: true },
        { id: "readouts", isIntersecting: true },
      ]);
    });

    const links = container.querySelectorAll(".acc-nav__link");
    expect(links[0]).toHaveClass("is-current");
    const sublinks = container.querySelectorAll(".acc-nav__sublink");
    expect(sublinks[0]).not.toHaveClass("is-current");
  });
});
