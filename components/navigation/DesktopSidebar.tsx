"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import AuthStatus from "@/components/AuthStatus";
import { navItems } from "@/components/navigation/navItems";

type DesktopSidebarProps = {
  pathname: string;
};

export default function DesktopSidebar({
  pathname,
}: DesktopSidebarProps) {
  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href;
  }

  return (
    <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:z-30 md:flex md:w-[220px] md:flex-col md:border-r md:border-[var(--border)] md:bg-[var(--background)]">
      <div className="flex h-full flex-col overflow-y-auto px-4 py-6">
        <div className="mb-8 flex items-center gap-3">
          <Logo />

          <div className="min-w-0">
            <div className="app-card-title leading-[1.1]">
              Capital Tracker
            </div>
            <div className="mt-1 text-[14px] leading-[16px] text-[var(--text-muted)]">
              Мои накопления
            </div>
          </div>
        </div>

        <div className="mb-3 app-nav-title">Навигация</div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium transition-all duration-150"
                style={{
                  background: active ? "var(--card)" : "transparent",
                  color: active
                    ? "var(--foreground)"
                    : "var(--text-muted)",
                }}
              >
                {active && (
                  <span
                    className="absolute left-0 top-1/2 h-[60%] w-[3px] -translate-y-1/2 rounded-full"
                    style={{ background: "#22c55e" }}
                  />
                )}

                <span
                  className="flex h-8 w-8 items-center justify-center rounded-lg transition-all"
                  style={{
                    background: active ? "var(--background)" : "transparent",
                  }}
                >
                  <Icon
                    size={16}
                    strokeWidth={2}
                    style={{
                      color: active
                        ? "var(--foreground)"
                        : "var(--text-muted)",
                    }}
                  />
                </span>

                <span>{item.label}</span>

                <style jsx>{`
                  a:hover {
                    background: var(--card);
                    color: var(--foreground) !important;
                  }

                  a:hover span:nth-child(2) {
                    background: var(--background);
                  }

                  a:hover svg {
                    color: var(--foreground) !important;
                  }
                `}</style>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6">
          <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2">
            <div className="text-[13px] text-[var(--text-secondary)]">
              Аккаунт
            </div>

            <AuthStatus />
          </div>
        </div>
      </div>
    </aside>
  );
}