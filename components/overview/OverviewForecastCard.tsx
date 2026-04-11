type OverviewForecastCardProps = {
  planForecastAmount: number;
  currentForecastAmount: number;
  statusText: string;
  explanationText: string;
  formatNumber: (value: number) => string;
};

export default function OverviewForecastCard({
  planForecastAmount,
  currentForecastAmount,
  statusText,
  explanationText,
  formatNumber,
}: OverviewForecastCardProps) {
  const safePlanAmount = Math.max(0, planForecastAmount);
  const safeCurrentAmount = Math.max(0, currentForecastAmount);

  const maxAmount = Math.max(safePlanAmount, safeCurrentAmount, 1);

  const planPercent = (safePlanAmount / maxAmount) * 100;
  const currentPercent = (safeCurrentAmount / maxAmount) * 100;

  const percentOfPlan =
    safePlanAmount > 0
      ? Math.round((safeCurrentAmount / safePlanAmount) * 100)
      : 0;

  const isAbovePlan = safeCurrentAmount > safePlanAmount * 1.01;
  const isBelowPlan = safeCurrentAmount < safePlanAmount * 0.99;

  const chipPrefix = isAbovePlan ? "↑ " : isBelowPlan ? "↓ " : "";
  const chipText = `${chipPrefix}${percentOfPlan}% от плана`;

  const currentBarBackground = isBelowPlan
    ? "linear-gradient(90deg, rgba(251, 191, 36, 0.82) 0%, rgba(217, 119, 6, 0.92) 100%)"
    : "linear-gradient(90deg, color-mix(in srgb, var(--accent) 58%, white 42%) 0%, var(--accent) 100%)";

  const currentValueColor = isBelowPlan ? "rgb(180, 83, 9)" : "var(--accent)";

  const chipStyles = isBelowPlan
    ? {
        color: "rgb(180, 83, 9)",
        background: "rgba(245, 158, 11, 0.12)",
        border: "1px solid rgba(245, 158, 11, 0.22)",
      }
    : isAbovePlan
      ? {
          color: "var(--accent)",
          background: "color-mix(in srgb, var(--accent) 12%, transparent)",
          border:
            "1px solid color-mix(in srgb, var(--accent) 20%, transparent)",
        }
      : {
          color: "var(--text-secondary)",
          background: "rgba(148, 163, 184, 0.12)",
          border: "1px solid rgba(148, 163, 184, 0.18)",
        };

  return (
    <section className="app-card">
      <div className="space-y-5">
        <div className="space-y-1.5">
          <h2 className="app-card-title">Прогноз накоплений</h2>
          <div className="app-card-description leading-relaxed">
            Показывает, к чему приведёт текущий темп накопления к концу срока.
            Рядом видно, как этот результат соотносится с исходным планом.
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <span className="app-text-secondary">По плану</span>
              <span className="app-text font-medium">
                {formatNumber(safePlanAmount)} ₽
              </span>
            </div>

            <div
              className="relative h-[10px] overflow-hidden rounded-full"
              style={{ background: "rgba(148, 163, 184, 0.14)" }}
            >
              <div
                className="relative h-full rounded-full"
                style={{
                  width: `${planPercent}%`,
                  background:
                    "linear-gradient(90deg, rgba(163, 176, 196, 0.88) 0%, rgba(120, 138, 164, 0.96) 100%)",
                }}
              >
                <div
                  className="pointer-events-none absolute inset-0 rounded-full"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.04) 55%, rgba(255,255,255,0) 100%)",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <span className="app-text-secondary">По текущему темпу</span>

              <span
                className="app-text font-medium whitespace-nowrap"
                style={{ color: currentValueColor }}
              >
                {formatNumber(safeCurrentAmount)} ₽
              </span>
            </div>

            <div
              className="relative h-[10px] overflow-hidden rounded-full"
              style={{ background: "rgba(148, 163, 184, 0.14)" }}
            >
              <div
                className="relative h-full rounded-full"
                style={{
                  width: `${currentPercent}%`,
                  background: currentBarBackground,
                }}
              >
                <div
                  className="pointer-events-none absolute inset-0 rounded-full"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.05) 55%, rgba(255,255,255,0) 100%)",
                  }}
                />
              </div>
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 space-y-0.5">
                <div className="app-text-small">{statusText}</div>
                <div className="app-text-small text-[var(--muted-foreground)] leading-relaxed">
                  {explanationText}
                </div>
              </div>

              <div className="shrink-0">
                <span
                  className="inline-flex items-center rounded-full px-2 py-[3px] text-[11px] leading-none font-medium whitespace-nowrap"
                  style={chipStyles}
                >
                  {chipText}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}