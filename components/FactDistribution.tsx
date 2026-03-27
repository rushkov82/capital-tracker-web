type FactDistributionItem = {
  category: string;
  amount: number;
};

type FactDistributionProps = {
  cardClass: string;
  items: FactDistributionItem[];
  totalAmount: number;
  formatNumber: (value: number) => string;
  formatPercent: (value: number) => string;
};

export default function FactDistribution({
  cardClass,
  items,
  totalAmount,
  formatNumber,
  formatPercent,
}: FactDistributionProps) {
  const filteredItems = items.filter((item) => item.amount > 0);

  return (
    <section className={cardClass}>
      <h2 className="app-card-title mb-3">Структура капитала</h2>

      <div className="border-t border-[var(--border)] pt-3">
        <div className="space-y-3">
          {filteredItems.map((item, index) => {
            const percent =
              totalAmount > 0 ? (item.amount / totalAmount) * 100 : 0;
            const isLast = index === filteredItems.length - 1;

            return (
              <div
                key={item.category}
                className={isLast ? "pb-0" : "border-b border-[var(--border)] pb-3"}
              >
                <div className="app-text">{item.category}</div>
                <div className="app-text-small mt-0.5">
                  {formatPercent(percent)} %
                </div>
                <div className="app-text mt-1">
                  {formatNumber(item.amount)} ₽
                </div>
              </div>
            );
          })}

          <div className="border-t border-[var(--border)] pt-3 flex items-center justify-between">
            <span className="app-text">Итого</span>
            <span className="app-text">{formatNumber(totalAmount)} ₽</span>
          </div>
        </div>
      </div>
    </section>
  );
}