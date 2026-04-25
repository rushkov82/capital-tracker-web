"use client";

import type { StructureItem } from "@/lib/operations-helpers";

type OverviewCategoryDistributionCardProps = {
  items: StructureItem[];
  totalCapital: number;
  formatNumber: (value: number) => string;
};

export default function OverviewCategoryDistributionCard({
  items,
  totalCapital,
  formatNumber,
}: OverviewCategoryDistributionCardProps) {
  return (
    <section className="app-card h-full">
      <div className="app-card-title">Распределение по категориям</div>

      {items.length === 0 ? (
        <div className="mt-4 app-text-small">
          Пока нет категорий с фактическим остатком
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {items.map((item) => {
            const sharePercent =
              totalCapital > 0
                ? Math.min(100, Math.round((item.amount / totalCapital) * 100))
                : 0;

            return (
              <div key={item.category} className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 text-[15px] text-[var(--foreground)]">
                    {item.category}
                  </div>
                  <div className="shrink-0 text-[15px] font-semibold text-[var(--foreground)]">
                    {formatNumber(item.amount)} ₽
                  </div>
                </div>

                <div className="h-[6px] overflow-hidden rounded-full bg-[var(--border)]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${sharePercent}%`,
                      background: "var(--accent)",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
