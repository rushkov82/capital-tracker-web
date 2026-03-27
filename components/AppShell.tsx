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
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-[260px_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden border-r border-[var(--border)] bg-[var(--background)] lg:block">
          <div className="flex h-full flex-col px-4 py-5">
            <div className="mb-8 flex items-center gap-3 px-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[var(--border)] bg-[var(--card)] text-sm font-semibold text-[var(--accent)]">
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

            <div className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
              Навигация
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block rounded-[10px] px-3 py-2.5 text-[14px] font-medium transition ${
                      isActive
                        ? "bg-[var(--card)] text-[var(--text-primary)]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--card)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-8 border-t border-[var(--border)] pt-4">
              <div className="rounded-[14px] border border-[var(--border)] bg-[var(--card)] p-4">
                <div className="mb-2 text-[14px] font-semibold text-[var(--text-primary)]">
                  Философия
                </div>
                <div className="text-[12px] leading-6 text-[var(--text-muted)]">
                  Не калькулятор на два вечера, а инструмент контроля капитала
                  на годы.
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Right side */}
        <div className="min-w-0">
          {/* Desktop topbar */}
          <div className="hidden border-b border-[var(--border)] bg-[var(--background)] px-8 py-4 lg:block">
            <div className="text-[14px] text-[var(--text-secondary)]">
              Инструмент стратегического планирования и контроля капитала
            </div>
          </div>

          {/* Mobile topbar */}
          <div className="border-b border-[var(--border)] bg-[var(--background)] px-4 py-4 lg:hidden">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[var(--border)] bg-[var(--card)] text-sm font-semibold text-[var(--accent)]">
                C
              </div>

              <div>
                <div className="text-[16px] font-semibold text-[var(--text-primary)]">
                  Capital Tracker
                </div>
                <div className="text-[12px] text-[var(--text-muted)]">
                  Система капитала
                </div>
              </div>
            </div>

            <div className="mt-3 overflow-x-auto">
              <nav className="flex min-w-max gap-2 pb-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`rounded-[10px] px-3 py-2 text-[14px] font-medium transition ${
                        isActive
                          ? "bg-[var(--card)] text-[var(--text-primary)]"
                          : "text-[var(--text-secondary)] hover:bg-[var(--card)] hover:text-[var(--text-primary)]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Page content */}
          <main className="min-w-0 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}