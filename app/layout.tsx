import "./globals.css";
import AppShell from "@/components/AppShell";

export const metadata = {
  title: "Capital Tracker",
  description: "Система капитала",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <div className="flex min-h-screen">
          {/* 👉 САЙДБАР СКРЫВАЕМ НА МОБИЛЕ */}
          <div className="hidden lg:block">
            <AppShell />
          </div>

          {/* 👉 КОНТЕНТ НА ВСЮ ШИРИНУ */}
          <main className="flex-1 w-full">{children}</main>
        </div>
      </body>
    </html>
  );
}