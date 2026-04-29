import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useRef } from "react";
import { useDialogPanel } from "./useDialogPanel";

function setupPanel() {
  const panel = document.createElement("div");
  const a = document.createElement("button");
  a.textContent = "first";
  const b = document.createElement("button");
  b.textContent = "middle";
  const c = document.createElement("button");
  c.textContent = "last";
  panel.append(a, b, c);
  document.body.append(panel);
  return { panel, first: a, middle: b, last: c };
}

function setupTrigger() {
  const t = document.createElement("button");
  t.textContent = "trigger";
  document.body.append(t);
  return t;
}

const flushRaf = () => new Promise((resolve) => setTimeout(resolve, 32));

beforeEach(() => {
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

function renderDialog(opts: {
  open: boolean;
  onClose: () => void;
  panel: HTMLElement;
  trigger: HTMLElement;
}) {
  return renderHook(
    ({ open }) => {
      const panelRef = useRef<HTMLElement | null>(opts.panel);
      const triggerRef = useRef<HTMLElement | null>(opts.trigger);
      useDialogPanel({ open, onClose: opts.onClose, panelRef, triggerRef });
    },
    { initialProps: { open: opts.open } },
  );
}

describe("useDialogPanel", () => {
  it("locks body scroll while open and restores on close", () => {
    document.body.style.overflow = "scroll";
    const { panel } = setupPanel();
    const trigger = setupTrigger();
    const onClose = vi.fn();

    const { rerender } = renderDialog({ open: true, onClose, panel, trigger });
    expect(document.body.style.overflow).toBe("hidden");

    rerender({ open: false });
    expect(document.body.style.overflow).toBe("scroll");
  });

  it("Escape calls onClose when open", () => {
    const { panel } = setupPanel();
    const trigger = setupTrigger();
    const onClose = vi.fn();
    renderDialog({ open: true, onClose, panel, trigger });

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("Escape is a no-op when closed", () => {
    const { panel } = setupPanel();
    const trigger = setupTrigger();
    const onClose = vi.fn();
    renderDialog({ open: false, onClose, panel, trigger });

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("returns focus to trigger after open→close", async () => {
    const { panel } = setupPanel();
    const trigger = setupTrigger();
    const onClose = vi.fn();
    const { rerender } = renderDialog({
      open: true,
      onClose,
      panel,
      trigger,
    });

    rerender({ open: false });
    await flushRaf();
    expect(document.activeElement).toBe(trigger);
  });

  it("does not steal focus on initial closed render", async () => {
    const { panel } = setupPanel();
    const trigger = setupTrigger();
    const onClose = vi.fn();

    const elsewhere = document.createElement("button");
    document.body.append(elsewhere);
    elsewhere.focus();

    renderDialog({ open: false, onClose, panel, trigger });
    await flushRaf();
    expect(document.activeElement).toBe(elsewhere);
  });

  it("Tab on last focusable wraps to first", () => {
    const { panel, first, last } = setupPanel();
    const trigger = setupTrigger();
    const onClose = vi.fn();
    renderDialog({ open: true, onClose, panel, trigger });

    last.focus();
    const event = new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      cancelable: true,
    });
    panel.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(first);
  });

  it("Shift+Tab on first focusable wraps to last", () => {
    const { panel, first, last } = setupPanel();
    const trigger = setupTrigger();
    const onClose = vi.fn();
    renderDialog({ open: true, onClose, panel, trigger });

    first.focus();
    const event = new KeyboardEvent("keydown", {
      key: "Tab",
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    panel.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(last);
  });
});
