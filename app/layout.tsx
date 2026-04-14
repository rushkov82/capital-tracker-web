import type { Metadata, Viewport } from "next";
import "./globals.css";
import ToastViewport from "@/components/ui/ToastViewport";

export const metadata: Metadata = {
  metadataBase: new URL("https://captrack.ru"),
  title: {
    default:
      "Capital Tracker — понятная система планирования и контроля накоплений",
    template: "%s | Capital Tracker",
  },
  description:
    "Планируй накопления, сохраняй реальные действия и следи за прогрессом в одном месте. Capital Tracker помогает держать общую картину перед глазами.",
  applicationName: "Capital Tracker",
  keywords: [
    "накопления",
    "как копить деньги",
    "план накоплений",
    "учет накоплений",
    "финансовый план",
    "личные финансы",
    "деньги",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title:
      "Capital Tracker — понятная система планирования и контроля накоплений",
    description:
      "План накоплений, реальные действия и прогресс — в одном месте.",
    url: "https://captrack.ru",
    siteName: "Capital Tracker",
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary",
    title:
      "Capital Tracker — понятная система планирования и контроля накоплений",
    description:
      "План накоплений, реальные действия и прогресс — в одном месте.",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Capital Tracker",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        {children}
        <ToastViewport />
      </body>
    </html>
  );
}
