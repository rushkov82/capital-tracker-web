"use client";

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

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <DesktopSidebar pathname={pathname} />

      <div className="min-h-screen min-w-0 md:pl-[220px]">
        <CoreDataProvider>
          <div className="flex min-h-screen flex-col">
            <div
              className="fixed right-4 z-40 md:hidden"
              style={{ top: "calc(7px + env(safe-area-inset-top, 0px))" }}
            >
              <AuthStatus />
            </div>

            <main
              className="min-w-0 flex-1 px-4 py-4 md:px-6 md:py-6"
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