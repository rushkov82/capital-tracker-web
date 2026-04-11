import type { Metadata, Viewport } from "next";
import Image from "next/image";
import Link from "next/link";
import { LayoutGrid, List, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "Capital Tracker — понятная система планирования и контроля накоплений",
  description:
    "Планируй накопления, сохраняй реальные действия и следи за прогрессом в одном месте. Capital Tracker помогает держать общую картину перед глазами.",
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { themeColor: "#ffffff" };

const flowCards = [
  { title: "Куда ты идёшь", text: "План показывает цель и направление." },
  { title: "Что ты делаешь сейчас", text: "Операции помогают не терять из виду реальные действия." },
  { title: "Что получается в итоге", text: "Обзор показывает прогресс и общую картину." },
];

const coreCards = [
  { title: "Обзор", text: "Чтобы видеть, где ты сейчас.", icon: LayoutGrid },
  {
    title: "Стратегия",
    text: "Чтобы задать план накоплений и наглядно посмотреть, к чему он может привести.",
    icon: Target,
  },
  { title: "Операции", text: "Чтобы сохранять реальные действия и не терять порядок.", icon: List },
];

const heroText =
  "Когда видно, сколько уже сделано, что происходит сейчас и куда ты идёшь дальше, копить деньги становится легче и спокойнее. Так накопления перестают быть чем-то случайным: видна общая картина, понятны свои действия и путь к результату.";

const heroBg = {
  background: `
    radial-gradient(55% 55% at 12% 88%, rgba(244, 192, 120, 0.42) 0%, rgba(244, 192, 120, 0) 70%),
    radial-gradient(42% 42% at 52% 96%, rgba(245, 176, 196, 0.28) 0%, rgba(245, 176, 196, 0) 72%),
    radial-gradient(44% 44% at 86% 8%, rgba(106, 199, 240, 0.34) 0%, rgba(106, 199, 240, 0) 72%),
    radial-gradient(50% 50% at 22% 18%, rgba(120, 220, 212, 0.22) 0%, rgba(120, 220, 212, 0) 68%),
    linear-gradient(135deg, #dff5ee 0%, #f6f2df 48%, #d9f1f3 100%)
  `,
};

function Phone({
  width,
  sizes,
  pos,
  shadow = "shadow-[0_30px_80px_rgba(15,23,42,0.22)]",
  sideButtons = false,
}: {
  width: string;
  sizes: string;
  pos: string;
  shadow?: string;
  sideButtons?: boolean;
}) {
  return (
    <div className={`relative ${width}`}>
      <div className={`relative rounded-[54px] bg-black p-[10px] ${shadow}`}>
        <div className="relative overflow-hidden rounded-[46px] bg-[#101010]">
          <div className="absolute left-1/2 top-[14px] z-20 h-[30px] w-[42%] -translate-x-1/2 rounded-full bg-black" />
          <div className="relative aspect-[430/932] w-full bg-[#171717]">
            <Image
              src="/hero-overview.png"
              alt="Экран обзора Capital Tracker"
              fill
              sizes={sizes}
              className="object-cover"
              style={{ objectPosition: pos }}
              priority
            />
          </div>
        </div>
        {sideButtons && (
          <>
            <div className="pointer-events-none absolute -left-[5px] top-[148px] h-[56px] w-[5px] rounded-l-full bg-[#1f1f1f]" />
            <div className="pointer-events-none absolute -right-[5px] top-[218px] h-[84px] w-[5px] rounded-r-full bg-[#1f1f1f]" />
            <div className="pointer-events-none absolute -right-[5px] top-[332px] h-[84px] w-[5px] rounded-r-full bg-[#1f1f1f]" />
          </>
        )}
      </div>
    </div>
  );
}

export default function EntryPage() {
  return (
    <main
      className="landing-page min-h-screen bg-[var(--background)] text-[var(--text-primary)]"
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
      <section className="relative h-[100svh] overflow-hidden lg:h-screen" style={heroBg}>
        <div className="mx-auto h-full max-w-6xl px-4 md:px-6">
          <div className="hidden h-full lg:grid lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-center lg:gap-10">
            <div className="flex h-full items-center">
              <div className="max-w-[560px]">
                <h1 className="max-w-[520px] text-[44px] leading-[1.02] font-semibold tracking-[-0.03em] text-black xl:text-[48px]">
                  Все твои накопления — здесь
                </h1>
                <p className="mt-8 max-w-[520px] text-[18px] leading-[1.7] text-black/58">{heroText}</p>
                <div className="mt-8 flex gap-3">
                  <Link
                    href="/app/overview"
                    className="inline-flex h-12 items-center justify-center rounded-[14px] border border-[var(--accent)] bg-[var(--accent)] px-6 text-[15px] font-medium text-white transition hover:opacity-95"
                  >
                    Начать накопления
                  </Link>
                  <a
                    href="#how-it-works"
                    className="inline-flex h-12 items-center justify-center rounded-[14px] border border-black/10 bg-white/70 px-6 text-[15px] font-medium text-black/80 backdrop-blur-sm transition hover:bg-white"
                  >
                    Как это работает
                  </a>
                </div>
              </div>
            </div>

            <div className="relative h-full overflow-hidden">
              <div className="absolute right-0 top-[78px] xl:top-[84px]">
                <Phone width="w-[455px]" sizes="455px" pos="center top" sideButtons />
              </div>
            </div>
          </div>

          <div className="flex h-full flex-col lg:hidden">
            <div className="pt-[26px]">
              <h1 className="max-w-[520px] text-[34px] leading-[1.02] font-semibold tracking-[-0.03em] text-black">
                Все твои накопления — здесь
              </h1>
              <p className="mt-6 max-w-[520px] text-[17px] leading-[1.7] text-black/58">{heroText}</p>
            </div>

            <div className="relative mt-6 min-h-0 flex-1 overflow-hidden">
              <div className="absolute left-1/2 top-0 -translate-x-1/2">
                <Phone
                  width="w-[290px]"
                  sizes="290px"
                  pos="center 22%"
                  shadow="shadow-[0_24px_60px_rgba(15,23,42,0.18)]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 pt-12 pb-12 sm:hidden">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 md:px-6">
          <Link
            href="/app/overview"
            className="inline-flex h-12 items-center justify-center rounded-[14px] border border-[var(--accent)] bg-[var(--accent)] px-6 text-[15px] font-medium text-white transition hover:opacity-95"
          >
            Начать накопления
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex h-12 items-center justify-center rounded-[14px] border border-black/10 bg-white px-6 text-[15px] font-medium text-black/80 transition hover:bg-white"
          >
            Как это работает
          </a>
        </div>
      </section>

      <section className="pt-0 md:pt-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="flex flex-col gap-4">
            <div className="rounded-[24px] border border-[var(--border)] bg-[var(--card)] p-6 md:p-8">
              <div className="text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]">
                Смысл
              </div>
              <h2 className="mt-3 text-[24px] leading-[1.1] font-semibold tracking-[-0.02em] md:text-[30px]">
                Деньги могут быть в разных местах. Понимание должно быть в одном
              </h2>
              <p className="mt-5 text-[16px] leading-[1.75] text-[var(--text-secondary)]">
                Деньги могут лежать в разных местах, но когда общей картины нет, легко потеряться.
                Становится непонятно, сколько уже удалось накопить, что происходит сейчас и что на
                самом деле приближает к цели.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {[
                {
                  label: "Путь",
                  title: "Делать накопления — это правильный путь",
                  text:
                    "Когда нужно что-то важное, хочется решить вопрос сразу. Поэтому многим знаком путь долга: взять сейчас и думать о последствиях потом. Путь накоплений устроен иначе. Он медленнее, но даёт больше ясности, больше опоры и ощущение, что ты движешься на своих условиях.",
                },
                {
                  label: "Подход",
                  title: "Главное — видеть свой путь, а не банковские продукты",
                  text:
                    "Банки помогают хранить деньги и пользоваться разными инструментами. Но когда речь идёт о накоплениях, важнее всего видеть общую картину: что у тебя уже есть, что ты делаешь сейчас и куда движешься дальше. Тогда понимание своих накоплений, своего плана и своего прогресса остаётся ближе к человеку, а не теряется среди чужих продуктов, условий и предложений.",
                },
              ].map((card) => (
                <div
                  key={card.label}
                  className="rounded-[24px] border border-[var(--border)] bg-[var(--card)] p-6 md:p-8"
                >
                  <div className="text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]">
                    {card.label}
                  </div>
                  <h2 className="mt-3 text-[24px] leading-[1.1] font-semibold tracking-[-0.02em] md:text-[30px]">
                    {card.title}
                  </h2>
                  <p className="mt-5 text-[16px] leading-[1.75] text-[var(--text-secondary)]">
                    {card.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="pt-12 md:pt-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="max-w-2xl px-5 md:px-0">
            <div className="text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]">
              Как это работает
            </div>
            <h2 className="mt-3 text-[28px] leading-[1.1] font-semibold tracking-[-0.02em] md:text-[36px]">
              Всё строится на трёх простых вещах
            </h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {flowCards.map((card) => (
              <article
                key={card.title}
                className="rounded-[20px] border border-[var(--border)] bg-[var(--card)] p-5"
              >
                <h3 className="text-[16px] leading-[1.2] font-semibold">{card.title}</h3>
                <p className="mt-3 text-[15px] leading-[1.65] text-[var(--text-secondary)]">
                  {card.text}
                </p>
              </article>
            ))}
          </div>

          <p className="mt-6 max-w-3xl px-5 text-[15px] leading-[1.7] text-[var(--text-secondary)] md:px-0">
            Этого достаточно, чтобы накопления перестали быть случайностью и стали понятным
            движением вперёд.
          </p>
        </div>
      </section>

      <section className="pt-12 md:pt-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="max-w-2xl px-5 md:px-0">
            <div className="text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]">
              Что внутри
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {coreCards.map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="rounded-[20px] border border-[var(--border)] bg-[var(--card)] p-5"
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={18} strokeWidth={2} className="text-[var(--text-primary)]" />
                  <h3 className="text-[16px] leading-[1.2] font-semibold">{title}</h3>
                </div>
                <p className="mt-3 text-[15px] leading-[1.65] text-[var(--text-secondary)]">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pt-12 pb-12 text-center md:px-6 md:pt-16 md:pb-16">
        <Link
          href="/app/overview"
          className="inline-flex h-11 items-center justify-center rounded-[12px] border border-[var(--accent)] bg-[var(--accent)] px-5 text-[15px] font-medium text-white transition hover:opacity-95"
        >
          Начать накопления
        </Link>
      </section>
    </main>
  );
}