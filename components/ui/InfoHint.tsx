"use client";

import { useEffect, useRef, useState } from "react";

type InfoHintProps = {
  title?: string;
  content: string;
};

export default function InfoHint({
  title = "Что это значит",
  content,
}: InfoHintProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={rootRef} className="app-info-root">
      <button
        type="button"
        aria-label="Пояснение"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="app-info-trigger"
      >
        ?
      </button>

      {open && (
        <div className="app-info-popover">
          <div className="app-info-title">{title}</div>
          <div className="app-info-text">{content}</div>
        </div>
      )}
    </div>
  );
}