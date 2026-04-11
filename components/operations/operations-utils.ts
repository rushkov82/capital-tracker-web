import type { Operation } from "@/lib/operations";

export type OperationsTypeFilter = "all" | "income" | "expense" | "adjustment";
export type OperationsPeriodFilter = "all" | "month" | "year";
export type OperationsSort = "newest" | "oldest" | "amount_desc" | "amount_asc";

export type OperationsSummary = {
  totalCount: number;
  incomeAmount: number;
  expenseAmount: number;
  netAmount: number;
};

export type OperationsGroup = {
  key: string;
  label: string;
  operations: Operation[];
};

export function filterOperations(
  operations: Operation[],
  {
    search,
    type,
    category,
    period,
  }: {
    search: string;
    type: OperationsTypeFilter;
    category: string;
    period: OperationsPeriodFilter;
  }
) {
  const query = search.trim().toLowerCase();
  const now = new Date();
  const nowYear = now.getFullYear();
  const nowMonth = now.getMonth();

  return operations.filter((operation) => {
    if (type !== "all" && operation.type !== type) {
      return false;
    }

    if (category !== "all" && (operation.asset_category || "") !== category) {
      return false;
    }

    if (period !== "all") {
      const date = new Date(operation.operation_date);

      if (period === "year" && date.getFullYear() !== nowYear) {
        return false;
      }

      if (
        period === "month" &&
        (date.getFullYear() !== nowYear || date.getMonth() !== nowMonth)
      ) {
        return false;
      }
    }

    if (!query) {
      return true;
    }

    const haystack = [
      operation.comment || "",
      operation.asset_category || "",
      getTypeLabel(operation.type),
      operation.operation_date,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}

export function sortOperations(
  operations: Operation[],
  sort: OperationsSort
): Operation[] {
  const copy = [...operations];

  if (sort === "newest") {
    return copy.sort(compareNewestFirst);
  }

  if (sort === "oldest") {
    return copy.sort(compareOldestFirst);
  }

  if (sort === "amount_desc") {
    return copy.sort((a, b) => b.amount - a.amount);
  }

  return copy.sort((a, b) => a.amount - b.amount);
}

export function buildOperationsSummary(
  operations: Operation[]
): OperationsSummary {
  let incomeAmount = 0;
  let expenseAmount = 0;
  let netAmount = 0;

  for (const operation of operations) {
    if (operation.type === "income") {
      incomeAmount += operation.amount;
      netAmount += operation.amount;
      continue;
    }

    if (operation.type === "expense") {
      expenseAmount += operation.amount;
      netAmount -= operation.amount;
      continue;
    }

    netAmount += operation.amount;
  }

  return {
    totalCount: operations.length,
    incomeAmount,
    expenseAmount,
    netAmount,
  };
}

export function groupOperationsByMonth(
  operations: Operation[]
): OperationsGroup[] {
  const map = new Map<string, Operation[]>();

  for (const operation of operations) {
    const date = new Date(operation.operation_date);
    const year = date.getFullYear();
    const month = date.getMonth();
    const key = `${year}-${String(month + 1).padStart(2, "0")}`;

    const existing = map.get(key) || [];
    existing.push(operation);
    map.set(key, existing);
  }

  return Array.from(map.entries())
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([key, items]) => {
      const [year, month] = key.split("-");
      const label = formatMonthYear(Number(year), Number(month) - 1);

      return {
        key,
        label,
        operations: items.sort(compareNewestFirst),
      };
    });
}

export function getOperationsCategories(operations: Operation[]) {
  return Array.from(
    new Set(
      operations
        .map((operation) => operation.asset_category)
        .filter((value): value is string => Boolean(value))
    )
  ).sort((a, b) => a.localeCompare(b, "ru"));
}

export function getTypeLabel(type: Operation["type"]) {
  if (type === "expense") return "Вывод";
  if (type === "adjustment") return "Переоценка";
  return "Пополнение";
}

export function getSignedAmount(operation: Operation) {
  if (operation.type === "expense") return -operation.amount;
  return operation.amount;
}

export function formatMonthYear(year: number, month: number) {
  return new Intl.DateTimeFormat("ru-RU", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month, 1));
}

function compareNewestFirst(a: Operation, b: Operation) {
  const dateCompare = b.operation_date.localeCompare(a.operation_date);
  if (dateCompare !== 0) return dateCompare;
  return b.created_at.localeCompare(a.created_at);
}

function compareOldestFirst(a: Operation, b: Operation) {
  const dateCompare = a.operation_date.localeCompare(b.operation_date);
  if (dateCompare !== 0) return dateCompare;
  return a.created_at.localeCompare(b.created_at);
}