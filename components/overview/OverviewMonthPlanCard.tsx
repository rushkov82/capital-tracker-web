"use client";

type OverviewMonthPlanCardProps = {
  monthLabel: string;
  monthlyPlan: number;
  currentMonthFact: number;
  remainingAmount: number;
  formatNumber: (value: number) => string;
};

export default function OverviewMonthPlanCard({
  monthLabel,
  monthlyPlan,
  currentMonthFact,
  remainingAmount,
  formatNumber,
}: OverviewMonthPlanCardProps) {
  const safePlan = Math.max(0, monthlyPlan);
  const safeFact = Math.max(0, currentMonthFact);
  const progressPercent =
    safePlan > 0 ? Math.min(100, Math.round((safeFact / safePlan) * 100)) : 0;

  return (
    <section className="app-card h-full">
      <div className="app-card-title">План на {monthLabel}</div>

      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="text-[15px] text-[var(--foreground)]">Цель месяца</div>
          <div className="text-[15px] font-semibold text-[var(--foreground)]">
            {formatNumber(safePlan)} ₽
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="text-[15px] text-[var(--foreground)]">Внесено</div>
          <div className="text-[15px] font-semibold text-[var(--foreground)]">
            {formatNumber(safeFact)} ₽
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="text-[15px] text-[var(--foreground)]">Осталось внести</div>
          <div className="text-[15px] font-semibold text-[var(--foreground)]">
            {formatNumber(remainingAmount)} ₽
          </div>
        </div>
      </div>

      <div className="mt-4 h-[6px] overflow-hidden rounded-full bg-[var(--border)]">
        <div
          className="h-full rounded-full"
          style={{
            width: `${progressPercent}%`,
            background: "var(--accent)",
          }}
        />
      </div>

      <div className="mt-3 app-text-small">{progressPercent}% от цели месяца</div>
    </section>
  );
}