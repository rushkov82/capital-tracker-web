"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/plan", label: "План" },
  { href: "/fact", label: "Факт" },
  { href: "/compare", label: "Сравнение" },
  { href: "/operations", label: "Операции" },
];

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="flex h-full flex-col px-4 py-5">
          <div className="mb-8 flex items-center gap-3 px-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[var(--border-default)] bg-[var(--bg-hover)] text-sm font-semibold text-[var(--accent)]">
              C
            </div>

            <div>
              <div className="text-[16px] font-semibold leading-5 text-[var(--text-primary)]">
                Capital Tracker
              </div>
              <div className="text-[12px] leading-4 text-[var(--text-muted)]">
                Система капитала
              </div>
            </div>
          </div>

          <div className="mb-3 px-2">
            <div className="app-nav-title">Навигация</div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`app-nav-item ${isActive ? "app-nav-item-active" : ""}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 border-t border-[var(--border-default)] pt-4">
            <div className="app-card">
              <div className="mb-2 text-[14px] font-semibold text-[var(--text-primary)]">
                Философия
              </div>
              <div className="text-[12px] leading-6 text-[var(--text-muted)]">
                Не калькулятор на два вечера, а инструмент контроля капитала на
                годы.
              </div>
            </div>
          </div>

          <div className="mt-auto px-2 pt-6 text-[12px] text-[var(--text-muted)]">
            v0.1 · локальная сборка
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <div className="app-topbar">
          <div className="text-[14px] text-[var(--text-secondary)]">
            Инструмент стратегического планирования и контроля капитала
          </div>
        </div>

        <div className="app-content">{children}</div>
      </div>
    </div>
  );
}