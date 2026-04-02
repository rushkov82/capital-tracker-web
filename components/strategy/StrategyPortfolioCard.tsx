import { formatPercent } from "@/lib/calculations";

type CompositionItem = {
  label: string;
  share: number;
};

type StrategyPortfolioCardProps = {
  items: CompositionItem[];
  portfolioRatePercent?: number;
};

export default function StrategyPortfolioCard({
  items,
  portfolioRatePercent,
}: StrategyPortfolioCardProps) {
  return (
    <section className="app-card">
      <div className="space-y-4">
        <div className="app-card-title">Состав портфеля</div>

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
                <div className="text-[14px] font-medium">{item.share}%</div>
              </div>
            ))}
          </div>
        )}

        {typeof portfolioRatePercent === "number" && (
          <div className="border-t border-[var(--border)] pt-4">
            <div className="app-text-small mb-1">Ориентир по доходности</div>
            <div className="text-[18px] font-semibold">
              {formatPercent(portfolioRatePercent)} %
            </div>
          </div>
        )}
      </div>
    </section>
  );
}