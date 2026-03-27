import "./globals.css";
import AppShell from "@/components/AppShell";
import type { Viewport } from "next";

export const metadata = {
  title: "Capital Tracker",
  description: "Система капитала",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}