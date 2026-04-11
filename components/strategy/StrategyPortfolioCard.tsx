import { formatPercent } from "@/lib/calculations";

type CompositionItem = {
  label: string;
  share: number;
};

type StrategyPortfolioCardProps = {
  items: CompositionItem[];
  portfolioRatePercent?: number;
  inflationPercent?: number;
};

export default function StrategyPortfolioCard({
  items,
  portfolioRatePercent,
  inflationPercent,
}: StrategyPortfolioCardProps) {
  const realRate =
    typeof portfolioRatePercent === "number" &&
    typeof inflationPercent === "number"
      ? portfolioRatePercent - inflationPercent
      : null;

  return (
    <section className="app-card">
      <div className="space-y-4">
        <div className="app-card-title">Твоя структура</div>

        {items.length === 0 ? (
          <div className="app-text-small">Пока ничего не выбрано</div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-4"
              >
                <div className="app-text-secondary">{item.label}</div>
                <div className="text-[14px] font-medium">
                  {item.share}%
                </div>
              </div>
            ))}
          </div>
        )}

        {typeof portfolioRatePercent === "number" && (
          <div className="border-t border-[var(--border)] pt-4 space-y-2">
            <div>
              <div className="app-text-small mb-1">
                Ориентир по доходности
              </div>

              <div
                className="text-[18px] font-semibold"
                style={{ color: "var(--accent)" }}
              >
                {formatPercent(portfolioRatePercent)} %
              </div>
            </div>

            {realRate !== null && (
              <div className="app-text-small">
                После инфляции:{" "}
                <span
                  className="font-medium"
                  style={{
                    color:
                      realRate > 0
                        ? "var(--accent)"
                        : "var(--danger)",
                  }}
                >
                  ~{formatPercent(realRate)} % в год
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}