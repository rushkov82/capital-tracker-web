"use client";

import { useState } from "react";
import { User } from "lucide-react";

export default function AuthStatus() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-[36px] w-[36px] items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--text-secondary)]"
      >
        <User size={18} />
      </button>

      {open && (
        <div
          className="
            absolute z-50 rounded-[12px] border border-[var(--border)]
            bg-[var(--card)] p-3 shadow-lg

            right-0 top-[44px] w-[220px]
            md:right-0 md:top-auto md:bottom-[44px] md:w-[180px]
          "
        >
          <div className="mb-1 text-[13px] font-medium text-[var(--text-primary)]">
            Аккаунт
          </div>

          <div className="text-[12px] leading-[1.35] text-[var(--text-secondary)]">
            Вход и синхронизация скоро появятся
          </div>
        </div>
      )}
    </div>
  );
}