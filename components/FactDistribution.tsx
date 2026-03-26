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
  return (
    <section className={cardClass}>
      <h2 className="app-card-title mb-5">Распределение фактических взносов</h2>

      <div className="space-y-3">
        {items.map((item) => {
          const percent =
            totalAmount > 0 ? (item.amount / totalAmount) * 100 : 0;

          return (
            <div key={item.category} className="app-list-row">
              <div className="flex flex-col">
                <span className="text-[14px] text-[var(--text-primary)]">
                  {item.category}
                </span>
                <span className="app-micro">{formatPercent(percent)} %</span>
              </div>
              <span className="text-[14px] font-medium text-[var(--text-primary)]">
                {formatNumber(item.amount)} ₽
              </span>
            </div>
          );
        })}

        <div className="flex items-center justify-between border-t border-[var(--border-default)] pt-3 font-semibold text-[var(--text-primary)]">
          <span>Итого</span>
          <span>{formatNumber(totalAmount)} ₽</span>
        </div>
      </div>
    </section>
  );
}