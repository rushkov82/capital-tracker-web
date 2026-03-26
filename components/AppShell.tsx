"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/plan", label: "План" },
  { href: "/fact", label: "Факт" },
  { href: "/compare", label: "Сравнение" },
  { href: "/operations", label: "Операции" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="app-root">
      {/* Sidebar (desktop) */}
      <aside className="app-sidebar">
        <div className="app-logo">
          <div className="app-logo-box">C</div>
          <div>
            <div className="app-logo-title">Capital Tracker</div>
            <div className="app-logo-sub">Система капитала</div>
          </div>
        </div>

        <div className="app-nav-title">Навигация</div>

        <nav className="app-nav">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`app-nav-item ${
                pathname === item.href ? "active" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile header */}
      <div className="app-mobile-header">
        <button onClick={() => setOpen(true)} className="app-burger">
          ☰
        </button>
        <div className="app-mobile-title">Capital Tracker</div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="app-mobile-menu">
          <div className="app-mobile-menu-inner">
            <button onClick={() => setOpen(false)}>✕</button>

            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="app-nav-item"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <main className="app-content">{children}</main>
    </div>
  );
}