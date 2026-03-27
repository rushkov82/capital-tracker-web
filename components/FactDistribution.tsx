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
      <h2 className="app-card-title mb-4">Структура капитала</h2>

      <div className="border-t border-[var(--border)] pt-3">
        <div className="grid grid-cols-[1.2fr_0.8fr_1fr] gap-3 pb-2">
          <div className="app-text-small">Категория</div>
          <div className="app-text-small text-right">Доля</div>
          <div className="app-text-small text-right">Сумма</div>
        </div>

        <div className="space-y-0">
          {filteredItems.map((item, index) => {
            const percent =
              totalAmount > 0 ? (item.amount / totalAmount) * 100 : 0;
            const isLast = index === filteredItems.length - 1;

            return (
              <div
                key={item.category}
                className={`grid grid-cols-[1.2fr_0.8fr_1fr] gap-3 items-center py-3 ${
                  isLast ? "" : "border-b border-[var(--border)]"
                }`}
              >
                <div className="app-label">{item.category}</div>
                <div className="app-label text-right">
                  {formatPercent(percent)} %
                </div>
                <div className="app-label text-right">
                  {formatNumber(item.amount)} ₽
                </div>
              </div>
            );
          })}

          <div className="border-t border-[var(--border)] mt-2 pt-3 grid grid-cols-[1.2fr_0.8fr_1fr] gap-3 items-center">
            <div className="app-label">Итого</div>
            <div />
            <div className="app-label text-right">
              {formatNumber(totalAmount)} ₽
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}