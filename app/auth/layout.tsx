import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-screen"
      style={
        {
          "--background": "#ffffff",
          "--foreground": "#0f172a",
          "--card": "#ffffff",
          "--border": "#e5e7eb",
          "--text-primary": "#0f172a",
          "--text-secondary": "#475569",
          "--text-muted": "#94a3b8",
          "--accent": "#22c55e",
          "--danger": "#ef4444",
          "--info": "#38bdf8",
          "--accent-blue": "var(--info)",
          colorScheme: "light",
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
