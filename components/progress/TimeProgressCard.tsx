type TimeProgressCardProps = {
  elapsedMonths: number;
  totalMonths: number;
  progressPercent: number;
};

export default function TimeProgressCard({
  elapsedMonths,
  totalMonths,
  progressPercent,
}: TimeProgressCardProps) {
  return (
    <section className="app-card">
      <div className="space-y-4">
        <div>
          <h2 className="app-card-title">Прогресс по времени</h2>
          <div className="app-text-small mt-1">
            Где ты находишься по времени внутри своего плана
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-[24px] font-semibold">
            {elapsedMonths} из {totalMonths} месяцев
          </div>

          <div className="app-text-small">{progressPercent}% пути по времени</div>

          <div className="h-2 rounded-full bg-[var(--border)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#22c55e]"
              style={{ width: `${Math.max(0, Math.min(100, progressPercent))}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}