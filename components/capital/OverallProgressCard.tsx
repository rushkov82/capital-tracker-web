type OverallProgressCardProps = {
  plannedNow: number;
  totalFactAmount: number;
  deviation: number;
  formatNumber: (value: number) => string;
};

export default function OverallProgressCard({
  plannedNow,
  totalFactAmount,
  deviation,
  formatNumber,
}: OverallProgressCardProps) {
  return (
    <section className="app-card md:col-span-2 xl:col-span-1">
      <h2 className="app-card-title mb-4">Общий прогресс по плану</h2>

      <div className="space-y-2 text-[14px]">
        <div className="flex items-center justify-between gap-4">
          <span>Должно быть сейчас</span>
          <b>{formatNumber(plannedNow)} ₽</b>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span>Фактически</span>
          <b>{formatNumber(totalFactAmount)} ₽</b>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span>Отклонение</span>
          <b style={{ color: deviation < 0 ? "#dc2626" : "#16a34a" }}>
            {formatNumber(deviation)} ₽
          </b>
        </div>
      </div>
    </section>
  );
}