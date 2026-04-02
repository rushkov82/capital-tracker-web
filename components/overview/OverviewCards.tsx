type OverviewCardsProps = {
  totalCapital: number;
  plannedNow: number;
  deviation: number;
  formatNumber: (value: number) => string;
};

export default function OverviewCards({
  totalCapital,
  plannedNow,
  deviation,
  formatNumber,
}: OverviewCardsProps) {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      <div className="app-card">
        <div className="app-text-small mb-2">Сейчас в капитале</div>
        <div className="text-[28px] leading-[32px] font-semibold">
          {formatNumber(totalCapital)} ₽
        </div>
      </div>

      <div className="app-card">
        <div className="app-text-small mb-2">По плану на сегодня</div>
        <div className="text-[28px] leading-[32px] font-semibold">
          {formatNumber(plannedNow)} ₽
        </div>
      </div>

      <div className="app-card">
        <div className="app-text-small mb-2">Отклонение</div>
        <div
          className="text-[28px] leading-[32px] font-semibold"
          style={{ color: deviation < 0 ? "#ef4444" : "#22c55e" }}
        >
          {deviation > 0 ? "+" : ""}
          {formatNumber(deviation)} ₽
        </div>
      </div>
    </section>
  );
}