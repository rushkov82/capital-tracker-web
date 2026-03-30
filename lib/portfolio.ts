import type { Operation } from "@/lib/operations";

export type FactDistributionItem = {
  category: string;
  amount: number;
};

function getCategoryByType(type: Operation["type"]) {
  if (type === "expense") return "Расходы";
  if (type === "adjustment") return "Корректировки";
  return "Пополнения";
}

export function buildFactDistribution(
  operations: Operation[]
): FactDistributionItem[] {
  const grouped = new Map<string, number>();

  for (const operation of operations) {
    const category = getCategoryByType(operation.type);

    const signedAmount =
      operation.type === "expense"
        ? -operation.amount
        : operation.amount;

    grouped.set(category, (grouped.get(category) || 0) + signedAmount);
  }

  return Array.from(grouped.entries())
    .map(([category, amount]) => ({
      category,
      amount,
    }))
    .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
}

export function getTotalFactAmount(items: FactDistributionItem[]) {
  return items.reduce((sum, item) => sum + item.amount, 0);
}