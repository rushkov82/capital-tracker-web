"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { User } from "lucide-react";

type MeResponse = {
  ok: boolean;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
};

export default function AuthStatus() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<MeResponse["user"]>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadMe() {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          cache: "no-store",
        });

        const data = (await response.json()) as MeResponse;

        if (!cancelled) {
          setUser(data.user ?? null);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadMe();

    return () => {
      cancelled = true;
    };
  }, []);

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

  const initial = useMemo(() => {
    if (!user?.name) return "";
    return user.name.trim().charAt(0).toUpperCase();
  }, [user]);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // молча
    }

    setUser(null);
    setOpen(false);
    window.location.href = "/app/overview";
  }

  const label = loading ? "Загрузка..." : user ? "Аккаунт" : "Не авторизован";

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-[44px] w-full items-center gap-3 rounded-[14px] border border-[var(--border)] bg-[var(--card)] px-3 text-left"
      >
        <div className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--text-secondary)]">
          {user ? (
            <span className="text-[12px] font-semibold text-[var(--text-primary)]">
              {initial}
            </span>
          ) : (
            <User size={15} />
          )}
        </div>

        <div className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[13px] text-[var(--text-secondary)]">
          {label}
        </div>
      </button>

      {open && (
        <div className="absolute bottom-[56px] left-0 z-50 w-full rounded-[12px] border border-[var(--border)] bg-[var(--card)] p-3 shadow-lg">
          {loading ? (
            <div className="text-[12px] leading-[1.35] text-[var(--text-secondary)]">
              Загружаем...
            </div>
          ) : user ? (
            <>
              <div className="mb-1 overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-medium text-[var(--text-primary)]">
                {user.name}
              </div>

              <div className="mb-3 overflow-hidden text-ellipsis whitespace-nowrap text-[12px] leading-[1.35] text-[var(--text-secondary)]">
                {user.email}
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="text-[13px] text-[var(--text-secondary)] underline-offset-4 hover:underline"
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <div className="mb-1 overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-medium text-[var(--text-primary)]">
                Не авторизован
              </div>

              <Link
                href="/auth"
                className="block overflow-hidden text-ellipsis whitespace-nowrap text-[13px] text-[var(--text-secondary)] underline-offset-4 hover:underline"
                onClick={() => setOpen(false)}
              >
                Вход / Регистрация
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
