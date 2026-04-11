"use client";

import Link from "next/link";
import { navItems } from "@/components/navigation/navItems";

type MobileBottomNavProps = {
  pathname: string;
  onNavigate?: (href: string) => void;
};

export default function MobileBottomNav({
  pathname,
  onNavigate,
}: MobileBottomNavProps) {
  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname === href;
  }

  return (
    <div className="fixed inset-x-0 bottom-[-17px] z-50 md:hidden">
      <nav className="mobile-bottom-nav-safe grid grid-cols-3 rounded-t-[18px] border border-[var(--border)] border-b-0 bg-[var(--background)]/98 shadow-[0_6px_24px_rgba(15,23,42,0.08)] backdrop-blur">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          const shift =
            index === 0
              ? "translate-x-[30px]"
              : index === 2
              ? "-translate-x-[30px]"
              : "";

          const content = (
            <div
              className={`flex flex-col items-center justify-center gap-[2px] ${shift}`}
            >
              <Icon size={20} strokeWidth={2} />
              <span className="max-w-full truncate text-[12px] font-medium leading-none">
                {item.label}
              </span>
            </div>
          );

          return onNavigate ? (
            <button
              key={item.href}
              type="button"
              onClick={() => onNavigate(item.href)}
              className="flex min-h-[63px] min-w-0 items-center justify-center px-1 pb-[13px] pt-[8px] transition-all"
              style={{
                color: active ? "var(--accent)" : "var(--text-primary)",
              }}
            >
              {content}
            </button>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-[63px] min-w-0 items-center justify-center px-1 pb-[13px] pt-[8px] transition-all"
              style={{
                color: active ? "var(--accent)" : "var(--text-primary)",
              }}
            >
              {content}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}