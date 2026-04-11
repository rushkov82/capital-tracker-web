"use client";

type OverviewHeroCardProps = {
  totalCapital: number;
  timeProgressPercent: number;
  statusText: string;
  formatNumber: (value: number) => string;
};

export default function OverviewHeroCard({
  totalCapital,
  statusText,
  formatNumber,
}: OverviewHeroCardProps) {
  return (
    <section className="app-card h-full">
      <div className="app-card-title">Мои накопления</div>

      <div
        className="mt-3 text-[34px] font-semibold leading-[1.05] tracking-[-0.02em]"
        style={{ color: "var(--accent)" }}
      >
        {formatNumber(totalCapital)} ₽
      </div>

      <div className="mt-3 app-text-small">{statusText}</div>
    </section>
  );
}