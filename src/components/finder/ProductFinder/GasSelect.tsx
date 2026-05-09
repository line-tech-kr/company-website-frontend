"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { GAS_FACTORS, type GasFactor } from "@/lib/finder/gas-factors";

type Props = {
  value: string;
  onChange: (gasId: string) => void;
  labels: {
    legend: string;
    placeholder: string;
    common: string;
    all: string;
    empty: string;
  };
};

function gasMatches(gas: GasFactor, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    gas.id.includes(q) ||
    gas.formula.toLowerCase().includes(q) ||
    gas.names.en.toLowerCase().includes(q)
  );
}

function renderLabel(gas: GasFactor): string {
  return `${gas.formula} — ${gas.names.en}`;
}

export function GasSelect({ value, onChange, labels }: Props) {
  const id = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const selectedGas = useMemo(
    () => GAS_FACTORS.find((g) => g.id === value),
    [value],
  );

  const { pinned, rest } = useMemo(() => {
    const filtered = GAS_FACTORS.filter((g) => gasMatches(g, query));
    return {
      pinned: filtered.filter((g) => g.pinned),
      rest: filtered.filter((g) => !g.pinned),
    };
  }, [query]);

  const flatOptions = useMemo(() => [...pinned, ...rest], [pinned, rest]);

  useEffect(() => {
    if (!open) return;
    function onDocPointer(e: PointerEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onDocPointer);
    return () => document.removeEventListener("pointerdown", onDocPointer);
  }, [open]);

  useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current.querySelector<HTMLLIElement>(
      `[data-finder-option-index="${activeIndex}"]`,
    );
    el?.scrollIntoView?.({ block: "nearest" });
  }, [activeIndex, open]);

  function commit(gas: GasFactor) {
    onChange(gas.id);
    setOpen(false);
    setQuery("");
    inputRef.current?.blur();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) setOpen(true);
      setActiveIndex((i) => Math.min(i + 1, flatOptions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (open && flatOptions[activeIndex]) {
        e.preventDefault();
        commit(flatOptions[activeIndex]);
      }
    } else if (e.key === "Escape") {
      if (open) {
        e.preventDefault();
        setOpen(false);
      }
    } else if (e.key === "Home") {
      setActiveIndex(0);
    } else if (e.key === "End") {
      setActiveIndex(Math.max(0, flatOptions.length - 1));
    }
  }

  const inputDisplay = open
    ? query
    : selectedGas
      ? renderLabel(selectedGas)
      : "";

  const listboxId = `${id}-listbox`;

  return (
    <fieldset className="lt-finder__group">
      <legend id={`${id}-label`} className="lt-finder__label">
        {labels.legend}
      </legend>
      <div ref={wrapRef} className="lt-finder__combo">
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            open && flatOptions[activeIndex]
              ? `${id}-opt-${activeIndex}`
              : undefined
          }
          className="lt-finder__combo-input"
          placeholder={labels.placeholder}
          value={inputDisplay}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(0);
            if (!open) setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
        />
        {open && (
          <ul
            id={listboxId}
            ref={listRef}
            role="listbox"
            aria-labelledby={`${id}-label`}
            className="lt-finder__combo-list"
          >
            {flatOptions.length === 0 ? (
              <li className="lt-finder__combo-empty" role="presentation">
                {labels.empty}
              </li>
            ) : (
              <>
                {pinned.length > 0 && (
                  <li className="lt-finder__combo-heading" role="presentation">
                    {labels.common}
                  </li>
                )}
                {pinned.map((g, i) => {
                  const idx = i;
                  const isActive = idx === activeIndex;
                  return (
                    <li
                      key={g.id}
                      id={`${id}-opt-${idx}`}
                      role="option"
                      aria-selected={isActive}
                      data-finder-option-index={idx}
                      className={`lt-finder__combo-opt${isActive ? " lt-finder__combo-opt--active" : ""}`}
                      onPointerDown={(e) => {
                        e.preventDefault();
                        commit(g);
                      }}
                      onPointerEnter={() => setActiveIndex(idx)}
                    >
                      <span className="lt-finder__combo-formula">
                        {g.formula}
                      </span>
                      <span className="lt-finder__combo-name">
                        {g.names.en}
                      </span>
                    </li>
                  );
                })}
                {rest.length > 0 && (
                  <li className="lt-finder__combo-heading" role="presentation">
                    {labels.all}
                  </li>
                )}
                {rest.map((g, i) => {
                  const idx = pinned.length + i;
                  const isActive = idx === activeIndex;
                  return (
                    <li
                      key={g.id}
                      id={`${id}-opt-${idx}`}
                      role="option"
                      aria-selected={isActive}
                      data-finder-option-index={idx}
                      className={`lt-finder__combo-opt${isActive ? " lt-finder__combo-opt--active" : ""}`}
                      onPointerDown={(e) => {
                        e.preventDefault();
                        commit(g);
                      }}
                      onPointerEnter={() => setActiveIndex(idx)}
                    >
                      <span className="lt-finder__combo-formula">
                        {g.formula}
                      </span>
                      <span className="lt-finder__combo-name">
                        {g.names.en}
                      </span>
                    </li>
                  );
                })}
              </>
            )}
          </ul>
        )}
      </div>
    </fieldset>
  );
}
