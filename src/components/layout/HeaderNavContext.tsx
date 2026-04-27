"use client";

import { createContext, useContext } from "react";

export type HeaderNavCtx = {
  openId: string | null;
  setOpenId: (id: string | null) => void;
  onItemEnter: (id: string) => void;
  onItemLeave: () => void;
};

const Ctx = createContext<HeaderNavCtx | null>(null);

export const HeaderNavProvider = Ctx.Provider;

export function useHeaderNav(): HeaderNavCtx {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error("useHeaderNav must be used inside <HeaderShell>");
  }
  return ctx;
}
