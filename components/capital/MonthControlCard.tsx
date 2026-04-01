type MonthControlCardProps = {
  monthlyPlan: number;
  currentMonthFact: number;
  currentMonthDelta: number;
  currentMonthRemaining: number;
  currentMonthOver: number;
  currentMonthStatusText: string;
  formatNumber: (value: number) => string;
};

export default function MonthControlCard({
  monthlyPlan,
  currentMonthFact,
  currentMonthDelta,
  currentMonthRemaining,
  currentMonthOver,
  currentMonthStatusText,
  formatNumber,
}: MonthControlCardProps) {
  return (
    <section className="app-card">
      <h2 className="app-card-title mb-4">Контроль месяца</h2>

      <div className="space-y-2 text-[14px]">
        <div className="flex items-center justify-between gap-4">
          <span>План на месяц</span>
          <b>{formatNumber(monthlyPlan)} ₽</b>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span>Внесено</span>
          <b>{formatNumber(currentMonthFact)} ₽</b>
        </div>

        {currentMonthDelta < 0 ? (
          <div className="flex items-center justify-between gap-4">
            <span>Осталось до плана</span>
            <b style={{ color: "#dc2626" }}>
              {formatNumber(currentMonthRemaining)} ₽
            </b>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <span>Перевыполнение</span>
            <b style={{ color: "#16a34a" }}>+{formatNumber(currentMonthOver)} ₽</b>
          </div>
        )}

        <div
          className="pt-2 text-[13px] font-medium"
          style={{
            color: currentMonthDelta < 0 ? "#dc2626" : "#16a34a",
          }}
        >
          {currentMonthStatusText}
        </div>
      </div>
    </section>
  );
}