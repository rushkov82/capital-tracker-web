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
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}