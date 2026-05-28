"use client";

import { useEffect } from "react";

export interface ShortcutHandlers {
  onUndo?: () => void;
  onRedo?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onClear?: () => void;
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;

  return (
    target.isContentEditable ||
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  );
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (isEditableTarget(event.target)) return;

      const hasModifier = event.ctrlKey || event.metaKey;
      const key = event.key.toLowerCase();

      if (hasModifier && key === "z" && !event.shiftKey) {
        event.preventDefault();
        handlers.onUndo?.();
      }

      if ((hasModifier && key === "y") || (hasModifier && event.shiftKey && key === "z")) {
        event.preventDefault();
        handlers.onRedo?.();
      }

      if (hasModifier && key === "c") {
        handlers.onCopy?.();
      }

      if (hasModifier && key === "v") {
        handlers.onPaste?.();
      }

      if (hasModifier && event.shiftKey && key === "backspace") {
        event.preventDefault();
        handlers.onClear?.();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handlers]);
}
