"use client";

import { createContext, useContext } from "react";

export type MobileNavCtx = {
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  /** Register the trigger so the panel can return focus on close. */
  registerMobileNavTrigger: (el: HTMLButtonElement | null) => void;
};

const Ctx = createContext<MobileNavCtx | null>(null);

export const MobileNavProvider = Ctx.Provider;

export function useMobileNav(): MobileNavCtx {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error("useMobileNav must be used inside <HeaderShell>");
  }
  return ctx;
}
