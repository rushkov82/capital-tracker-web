type PlanVsFactCardProps = {
  plannedNow: number;
  totalCapital: number;
  deviation: number;
  formatNumber: (value: number) => string;
};

export default function PlanVsFactCard({
  plannedNow,
  totalCapital,
  deviation,
  formatNumber,
}: PlanVsFactCardProps) {
  return (
    <section className="app-card">
      <div className="space-y-4">
        <div>
          <h2 className="app-card-title">План vs факт</h2>
          <div className="app-text-small mt-1">
            Честное сравнение твоего плана с текущей реальностью
          </div>
        </div>

        <div className="space-y-3 text-[14px]">
          <div className="flex items-center justify-between gap-4">
            <span>По плану на сегодня</span>
            <b>{formatNumber(plannedNow)} ₽</b>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span>Фактически</span>
            <b>{formatNumber(totalCapital)} ₽</b>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span>Отклонение</span>
            <b style={{ color: deviation >= 0 ? "#22c55e" : "#ef4444" }}>
              {deviation > 0 ? "+" : ""}
              {formatNumber(deviation)} ₽
            </b>
          </div>
        </div>
      </div>
    </section>
  );
}