import React from "react";
import { vi } from "vitest";

// Side-effect import: importing this file registers vi.mock for next-intl + @/i18n/navigation.
// Tests using next-intl translations or i18n-aware Link should `import "@/test/mocks/i18n"`
// as the first import in the file.

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

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
}));
