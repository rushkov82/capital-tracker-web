type ProgressStatusCardProps = {
  title: string;
  deviation: number;
  formatNumber: (value: number) => string;
};

export default function ProgressStatusCard({
  title,
  deviation,
  formatNumber,
}: ProgressStatusCardProps) {
  const isPositive = deviation >= 0;
  const color = isPositive ? "#22c55e" : "#ef4444";

  return (
    <section className="app-card">
      <div className="space-y-3">
        <div className="app-card-title">{title}</div>

        <div
          className="text-[28px] leading-[32px] font-semibold"
          style={{ color }}
        >
          {isPositive ? "+" : ""}
          {formatNumber(deviation)} ₽
        </div>

        <div className="app-text-small">
          Разница между тем, сколько должно быть по плану на сегодня, и тем,
          сколько у тебя есть фактически
        </div>
      </div>
    </section>
  );
}