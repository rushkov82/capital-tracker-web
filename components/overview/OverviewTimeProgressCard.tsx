"use client";

type OverviewTimeProgressCardProps = {
  elapsedMonths: number;
  totalMonths: number;
  progressPercent: number;
};

export default function OverviewTimeProgressCard({
  elapsedMonths,
  totalMonths,
  progressPercent,
}: OverviewTimeProgressCardProps) {
  const safeElapsedMonths = Math.max(0, elapsedMonths);
  const safeTotalMonths = Math.max(1, totalMonths);
  const currentMonth = Math.min(safeElapsedMonths + 1, safeTotalMonths);
  const safePercent = Math.max(0, Math.min(100, progressPercent));

  return (
    <section className="app-card h-full">
      <div className="app-card-title">Прогресс по времени</div>

      <div className="mt-1 app-text-small">
        Где находится текущий момент внутри общего плана
      </div>

      <div className="mt-4 text-[16px] font-semibold leading-[1.2] text-[var(--foreground)] md:text-[18px]">
        {currentMonth} из {safeTotalMonths} месяцев
      </div>

      <div className="mt-4 app-text-small">{safePercent}% пути по времени</div>

      <div className="mt-3 h-[6px] overflow-hidden rounded-full bg-[var(--border)]">
        <div
          className="h-full rounded-full"
          style={{
            width: `${safePercent}%`,
            background: "var(--accent)",
          }}
        />
      </div>
    </section>
  );
}