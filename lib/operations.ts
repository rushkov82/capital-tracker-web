export type OperationType = "income" | "expense" | "adjustment";

export type Operation = {
  id: string;
  amount: number;
  comment: string | null;
  operation_date: string;
  asset_category: string | null;
  created_at: string;
  type: OperationType;
};

type CreateOperationInput = {
  amount: number;
  comment?: string | null;
  operation_date?: string;
  asset_category?: string | null;
  type: OperationType;
};

type UpdateOperationInput = {
  amount?: number;
  comment?: string | null;
  asset_category?: string | null;
};

const STORAGE_KEY = "capital_operations";

function canUseStorage() {
  return typeof window !== "undefined";
}

function loadOperations(): Operation[] {
  if (!canUseStorage()) return [];

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as Operation[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveOperations(operations: Operation[]) {
  if (!canUseStorage()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(operations));
}

export async function fetchOperations(): Promise<Operation[]> {
  return loadOperations().sort(
    (a, b) =>
      new Date(b.operation_date).getTime() - new Date(a.operation_date).getTime()
  );
}

export async function createOperation(
  input: CreateOperationInput
): Promise<Operation> {
  const operations = loadOperations();

  const operation: Operation = {
    id: crypto.randomUUID(),
    amount: Number(input.amount),
    comment: input.comment ?? null,
    operation_date: input.operation_date ?? new Date().toISOString(),
    asset_category: input.asset_category ?? null,
    created_at: new Date().toISOString(),
    type: input.type,
  };

  const updated = [operation, ...operations];
  saveOperations(updated);

  return operation;
}

export async function updateOperation(
  id: string,
  input: UpdateOperationInput
): Promise<Operation> {
  const operations = loadOperations();

  let updatedOperation: Operation | null = null;

  const updated = operations.map((operation) => {
    if (operation.id !== id) return operation;

    updatedOperation = {
      ...operation,
      amount:
        input.amount !== undefined ? Number(input.amount) : operation.amount,
      comment:
        input.comment !== undefined ? input.comment : operation.comment,
      asset_category:
        input.asset_category !== undefined
          ? input.asset_category
          : operation.asset_category,
    };

    return updatedOperation;
  });

  if (!updatedOperation) {
    throw new Error("Операция не найдена");
  }

  saveOperations(updated);
  return updatedOperation;
}

export async function deleteOperation(id: string): Promise<void> {
  const operations = loadOperations();
  const updated = operations.filter((operation) => operation.id !== id);
  saveOperations(updated);
}