import { formatNumber, formatPercent } from "@/lib/calculations";

type StructureItem = {
  category: string;
  amount: number;
};

type CapitalStructureCardProps = {
  items: StructureItem[];
  totalCapital: number;
};

export default function CapitalStructureCard({
  items,
  totalCapital,
}: CapitalStructureCardProps) {
  const filteredItems = items.filter((item) => item.amount !== 0);

  return (
    <section className="app-card">
      <div className="space-y-4">
        <div>
          <h2 className="app-card-title">Структура капитала</h2>
          <div className="app-text-small mt-1">
            Как фактически распределены твои деньги сейчас
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="app-text-small">Пока нет данных по структуре</div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => {
              const percent =
                totalCapital !== 0 ? (item.amount / totalCapital) * 100 : 0;

              return (
                <div
                  key={item.category}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="space-y-0.5">
                    <div className="text-[14px] font-medium">
                      {item.category}
                    </div>
                    <div className="app-text-small">
                      {formatPercent(percent)} %
                    </div>
                  </div>

                  <div className="text-[15px] font-semibold whitespace-nowrap">
                    {formatNumber(item.amount)} ₽
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}