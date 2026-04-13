"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import DesktopSidebar from "@/components/navigation/DesktopSidebar";
import MobileBottomNav from "@/components/navigation/MobileBottomNav";
import AuthStatus from "@/components/AuthStatus";
import { CoreDataProvider } from "@/components/core/CoreDataProvider";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Отключаем восстановление скролла браузером и принудительно ставим страницу в начало.
  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    // Повторяем после рендера, чтобы перебить возможное восстановление прокрутки.
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <DesktopSidebar pathname={pathname} />

      <div className="min-h-screen min-w-0 md:pl-[220px]">
        <CoreDataProvider>
          <div className="flex min-h-screen flex-col">
            <main
              className="min-w-0 flex-1 px-4 pb-4 pt-0 md:px-6 md:py-6"
              style={{
                paddingBottom: "calc(96px + env(safe-area-inset-bottom, 0px))",
              }}
            >
              {children}
            </main>
          </div>
        </CoreDataProvider>
      </div>

      <MobileBottomNav pathname={pathname} />
    </div>
  );
}
