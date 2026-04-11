import { normalizeAssetCategory } from "@/lib/constants";
import type { Operation } from "@/lib/operations";

export type StructureItem = {
  category: string;
  amount: number;
};

export function normalizeOperations(operations: Operation[]): Operation[] {
  return operations.map((operation) => ({
    ...operation,
    asset_category: normalizeAssetCategory(operation.asset_category),
  }));
}

export function calculateTotalCapital(operations: Operation[]): number {
  return operations.reduce((sum, operation) => {
    if (operation.type === "expense") {
      return sum - operation.amount;
    }

    return sum + operation.amount;
  }, 0);
}

export function buildStructureFromOperations(
  operations: Operation[]
): StructureItem[] {
  const grouped = new Map<string, number>();

  for (const operation of operations) {
    const category = operation.asset_category || "Без категории";
    const signedAmount =
      operation.type === "expense" ? -operation.amount : operation.amount;

    grouped.set(category, (grouped.get(category) || 0) + signedAmount);
  }

  return Array.from(grouped.entries())
    .map(([category, amount]) => ({
      category,
      amount,
    }))
    .filter((item) => item.amount !== 0)
    .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
}

export function sortOperationsByDate(operations: Operation[]): Operation[] {
  return [...operations].sort((a, b) => {
    const dateCompare = b.operation_date.localeCompare(a.operation_date);
    if (dateCompare !== 0) return dateCompare;

    return b.created_at.localeCompare(a.created_at);
  });
}

export function buildRecentOperations(
  operations: Operation[],
  limit = 5
): Operation[] {
  return sortOperationsByDate(operations).slice(0, limit);
}