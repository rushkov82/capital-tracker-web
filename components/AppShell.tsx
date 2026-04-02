"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Обзор" },
  { href: "/strategy", label: "Стратегия" },
  { href: "/capital", label: "Капитал" },
  { href: "/progress", label: "Прогресс" },
];

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href;
  }

  return (
    <div className="app-shell-root">
      <div className="app-shell-layout">
        <aside className="app-sidebar app-sidebar-desktop">
          <div className="app-sidebar-inner">
            <div className="mb-8 app-brand">
              <div className="app-brand-box">C</div>

              <div>
                <div className="app-card-title">Capital Tracker</div>
                <div className="app-text-small">Система капитала</div>
              </div>
            </div>

            <div className="mb-3 app-nav-title">Навигация</div>

            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`app-nav-item ${
                    isActive(item.href) ? "app-nav-item-active" : ""
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="app-topbar app-topbar-desktop">
            <div className="app-text-secondary">
              Инструмент стратегического планирования и контроля капитала
            </div>
          </div>

          <div className="app-mobile-topbar app-topbar-mobile">
            <div className="app-brand">
              <div className="app-brand-box">C</div>

              <div>
                <div className="app-card-title">Capital Tracker</div>
                <div className="app-text-small">Система капитала</div>
              </div>
            </div>

            <div className="mt-3 overflow-x-auto">
              <nav className="flex min-w-max gap-2 pb-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`app-nav-item whitespace-nowrap ${
                      isActive(item.href) ? "app-nav-item-active" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          <main className="app-main">{children}</main>
        </div>
      </div>
    </div>
  );
}