import { ASSET_CATEGORIES } from "@/lib/constants";
import type { Operation } from "@/lib/operations";

export type FactDistributionItem = {
  category: string;
  amount: number;
};

export function buildFactDistribution(
  operations: Operation[]
): FactDistributionItem[] {
  const base: Record<string, number> = Object.fromEntries(
    ASSET_CATEGORIES.map((category) => [category, 0])
  );

  for (const op of operations) {
    const category =
      op.asset_category && ASSET_CATEGORIES.includes(op.asset_category as any)
        ? op.asset_category
        : "Прочее";

    base[category] += Number(op.amount) || 0;
  }

  return ASSET_CATEGORIES.map((category) => ({
    category,
    amount: base[category] || 0,
  }));
}

export function getTotalFactAmount(items: FactDistributionItem[]) {
  return items.reduce((sum, item) => sum + item.amount, 0);
}