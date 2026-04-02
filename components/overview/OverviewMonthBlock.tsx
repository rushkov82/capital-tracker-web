type OverviewMonthBlockProps = {
  monthlyPlan: number;
  currentMonthFact: number;
  remainingThisMonth: number;
  monthStatusText: string;
  formatNumber: (value: number) => string;
};

export default function OverviewMonthBlock({
  monthlyPlan,
  currentMonthFact,
  remainingThisMonth,
  monthStatusText,
  formatNumber,
}: OverviewMonthBlockProps) {
  const isBehind = currentMonthFact < monthlyPlan;

  return (
    <section className="app-card">
      <div className="space-y-4">
        <div>
          <h2 className="app-card-title">Текущий месяц</h2>
          <div className="app-text-small mt-1">
            Что происходит прямо сейчас и сколько осталось до выполнения плана
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <div className="app-text-small mb-1">План на месяц</div>
            <div className="text-[22px] font-semibold">
              {formatNumber(monthlyPlan)} ₽
            </div>
          </div>

          <div>
            <div className="app-text-small mb-1">Внесено</div>
            <div className="text-[22px] font-semibold">
              {formatNumber(currentMonthFact)} ₽
            </div>
          </div>

          <div>
            <div className="app-text-small mb-1">
              {isBehind ? "Осталось" : "Перевыполнение"}
            </div>
            <div
              className="text-[22px] font-semibold"
              style={{ color: isBehind ? "#ef4444" : "#22c55e" }}
            >
              {isBehind ? "" : "+"}
              {formatNumber(Math.abs(remainingThisMonth))} ₽
            </div>
          </div>
        </div>

        <div
          className="text-[14px] font-medium"
          style={{ color: isBehind ? "#ef4444" : "#22c55e" }}
        >
          {monthStatusText}
        </div>
      </div>
    </section>
  );
}