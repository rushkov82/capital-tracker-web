import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";
import ToastViewport from "@/components/ui/ToastViewport";

export const metadata: Metadata = {
  title: "Capital Tracker",
  description: "Инструмент стратегического планирования и контроля капитала",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <AppShell>{children}</AppShell>
        <ToastViewport />
      </body>
    </html>
  );
}