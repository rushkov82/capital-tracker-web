type ProgressCurrentMonthCardProps = {
  monthlyPlan: number;
  currentMonthFact: number;
  differenceThisMonth: number;
  formatNumber: (value: number) => string;
};

export default function ProgressCurrentMonthCard({
  monthlyPlan,
  currentMonthFact,
  differenceThisMonth,
  formatNumber,
}: ProgressCurrentMonthCardProps) {
  const isBehind = differenceThisMonth < 0;
  const title = isBehind ? "Осталось до плана" : "Перевыполнение";
  const value = Math.abs(differenceThisMonth);

  return (
    <section className="app-card">
      <div className="space-y-4">
        <div>
          <h2 className="app-card-title">Текущий месяц</h2>
          <div className="app-text-small mt-1">
            Что происходит в этом месяце прямо сейчас
          </div>
        </div>

        <div className="space-y-3 text-[14px]">
          <div className="flex items-center justify-between gap-4">
            <span>План на месяц</span>
            <b>{formatNumber(monthlyPlan)} ₽</b>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span>Внесено</span>
            <b>{formatNumber(currentMonthFact)} ₽</b>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span>{title}</span>
            <b style={{ color: isBehind ? "#ef4444" : "#22c55e" }}>
              {isBehind ? "" : "+"}
              {formatNumber(value)} ₽
            </b>
          </div>
        </div>
      </div>
    </section>
  );
}