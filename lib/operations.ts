export type Operation = {
  id: string;
  amount: number;
  comment: string | null;
  operation_date: string;
  asset_category: string | null;
  created_at: string;
};

const STORAGE_KEY = "capital_operations";

export async function fetchOperations(): Promise<Operation[]> {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function createOperation(data: {
  amount: number;
  comment: string;
  operation_date: string;
  asset_category: string;
}) {
  const current = await fetchOperations();

  const newItem: Operation = {
    id: crypto.randomUUID(),
    amount: data.amount,
    comment: data.comment,
    operation_date: data.operation_date,
    asset_category: data.asset_category,
    created_at: new Date().toISOString(),
  };

  const updated = [newItem, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export async function deleteOperation(id: string) {
  const current = await fetchOperations();
  const updated = current.filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export async function updateOperation(
  id: string,
  data: { amount: number; comment: string }
) {
  const current = await fetchOperations();

  const updated = current.map((item) => {
    if (item.id !== id) return item;

    return {
      ...item,
      amount: data.amount,
      comment: data.comment,
    };
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}