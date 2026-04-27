"use client";

import { createContext, useContext } from "react";

export type SearchCtx = {
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  /** Register the trigger so the panel can return focus on close. */
  registerSearchTrigger: (el: HTMLButtonElement | null) => void;
};

const Ctx = createContext<SearchCtx | null>(null);

export const SearchProvider = Ctx.Provider;

export function useSearch(): SearchCtx {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error("useSearch must be used inside <HeaderShell>");
  }
  return ctx;
}
