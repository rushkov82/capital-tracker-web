"use client";

import Link from "next/link";
import type { ReactNode } from "react";

const authBg = {
  background: `
    radial-gradient(55% 55% at 12% 88%, rgba(244, 192, 120, 0.42) 0%, rgba(244, 192, 120, 0) 70%),
    radial-gradient(42% 42% at 52% 96%, rgba(245, 176, 196, 0.28) 0%, rgba(245, 176, 196, 0) 72%),
    radial-gradient(44% 44% at 86% 8%, rgba(106, 199, 240, 0.34) 0%, rgba(106, 199, 240, 0) 72%),
    radial-gradient(50% 50% at 22% 18%, rgba(120, 220, 212, 0.22) 0%, rgba(120, 220, 212, 0) 68%),
    linear-gradient(135deg, #dff5ee 0%, #f6f2df 48%, #d9f1f3 100%)
  `,
};

type AuthShellProps = {
  children: ReactNode;
};

export default function AuthShell({ children }: AuthShellProps) {
  return (
    <main className="min-h-screen text-[var(--text-primary)]" style={authBg}>
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-8 md:px-6">
        <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-10">
          <section className="hidden lg:flex lg:flex-col lg:justify-center">
            <div className="max-w-[560px]">
              <div className="text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]">
                Capital Tracker
              </div>

              <h1 className="mt-4 text-[40px] leading-[1.02] font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                Вход и регистрация
              </h1>

              <p className="mt-6 max-w-[520px] text-[17px] leading-[1.75] text-[var(--text-secondary)]">
                Зарегистрируйся или войди, чтобы сохранять свои данные и возвращаться к
                ним позже. А если хочешь просто посмотреть, можно открыть демо.
              </p>
            </div>
          </section>

          <section className="w-full">
            <div className="rounded-[24px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] md:p-8">
              {children}
            </div>

            <div className="mt-4 text-center text-[13px] leading-[18px] text-[var(--text-muted)]">
              <Link href="/" className="underline-offset-4 hover:underline">
                Вернуться на главную
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
