import "@/test/mocks/i18n";

import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { DownloadsList } from "./DownloadsList";

const baseProps = {
  kicker: "04 — Downloads",
  heading: "Downloads",
  sub: "",
  downloadLabel: "Download",
  doneLabel: "Done",
};

describe("DownloadsList", () => {
  it("renders the CERT badge with the accent class on a cert item", () => {
    const { container } = render(
      <DownloadsList
        {...baseProps}
        items={[
          {
            label: "CE DoC — MS3150VA",
            type: "CERT",
            size: "146 KB",
            date: "2022",
            href: "https://cdn.example.com/cert.pdf",
          },
        ]}
      />,
    );

    const badge = container.querySelector(".lt-pdp-dl__type");
    expect(badge?.textContent).toBe("CERT");
    expect(badge?.className).toContain("lt-pdp-dl__type--accent");
  });

  it("falls back to the request-style button when href is missing", () => {
    const { container, getByRole } = render(
      <DownloadsList
        {...baseProps}
        items={[
          {
            label: "CE DoC — MS3150VA",
            type: "CERT",
            size: "146 KB",
            date: "2022",
          },
        ]}
      />,
    );

    expect(container.querySelector("a[download]")).toBeNull();
    expect(getByRole("button")).toBeTruthy();
  });
});
