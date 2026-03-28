"use client";

import { useEffect, useRef, useState } from "react";
import {
  dismissToast,
  subscribeToToasts,
  type ToastItem,
} from "@/lib/toast";

export default function ToastViewport() {
  const [items, setItems] = useState<ToastItem[]>([]);
  const timersRef = useRef<Record<string, number>>({});

  useEffect(() => {
    return subscribeToToasts(setItems);
  }, []);

  useEffect(() => {
    for (const item of items) {
      if (timersRef.current[item.id]) continue;

      timersRef.current[item.id] = window.setTimeout(() => {
        dismissToast(item.id);
        delete timersRef.current[item.id];
      }, item.duration ?? 3500);
    }

    const currentIds = new Set(items.map((item) => item.id));

    for (const id of Object.keys(timersRef.current)) {
      if (!currentIds.has(id)) {
        window.clearTimeout(timersRef.current[id]);
        delete timersRef.current[id];
      }
    }
  }, [items]);

  return (
    <div className="pointer-events-none fixed z-[100] right-4 top-4 flex w-[min(380px,calc(100vw-32px))] flex-col gap-3 max-sm:left-4 max-sm:right-4 max-sm:top-auto max-sm:bottom-4">
      {items.map((item) => {
        const tone = getToastTone(item.type);

        return (
          <div
            key={item.id}
            className="pointer-events-auto overflow-hidden rounded-[16px] border bg-[var(--card)] shadow-[0_14px_36px_rgba(0,0,0,0.14)] backdrop-blur-sm"
            style={{ borderColor: tone.border }}
          >
            <div
              className="h-[4px]"
              style={{ background: tone.accent }}
            />

            <div className="flex items-start gap-3 p-4">
              <div
                className="mt-[1px] flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[16px]"
                style={{
                  background: tone.iconBg,
                  color: tone.iconColor,
                }}
              >
                {tone.icon}
              </div>

              <div className="min-w-0 flex-1">
                <div
                  className="text-[14px] font-semibold leading-[20px]"
                  style={{ color: tone.titleColor }}
                >
                  {item.title}
                </div>

                {item.description ? (
                  <div className="mt-1 text-[13px] leading-[18px] text-[var(--text-secondary)]">
                    {item.description}
                  </div>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => dismissToast(item.id)}
                className="rounded-[8px] px-2 py-1 text-[12px] leading-[16px] text-[var(--text-secondary)] transition hover:bg-[var(--background)] hover:text-[var(--text-primary)]"
              >
                Закрыть
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function getToastTone(type: ToastItem["type"]) {
  if (type === "success") {
    return {
      accent: "#16a34a",
      border: "rgba(22,163,74,0.22)",
      iconBg: "rgba(22,163,74,0.12)",
      iconColor: "#16a34a",
      titleColor: "var(--text-primary)",
      icon: "✓",
    };
  }

  if (type === "error") {
    return {
      accent: "#dc2626",
      border: "rgba(220,38,38,0.22)",
      iconBg: "rgba(220,38,38,0.12)",
      iconColor: "#dc2626",
      titleColor: "var(--text-primary)",
      icon: "!",
    };
  }

  return {
    accent: "#2563eb",
    border: "rgba(37,99,235,0.22)",
    iconBg: "rgba(37,99,235,0.12)",
    iconColor: "#2563eb",
    titleColor: "var(--text-primary)",
    icon: "i",
  };
}