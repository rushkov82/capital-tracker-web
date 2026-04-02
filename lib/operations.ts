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

const OPERATIONS_STORAGE_KEY = "capital_operations";

function isLocalMode() {
  if (typeof window === "undefined") return false;

  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1";
}

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || "Ошибка запроса");
  }

  return data;
}

function readLocalOperations(): Operation[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(OPERATIONS_STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as Operation[];

    return [...parsed].sort((a, b) => {
      const dateCompare = b.operation_date.localeCompare(a.operation_date);
      if (dateCompare !== 0) return dateCompare;
      return b.created_at.localeCompare(a.created_at);
    });
  } catch {
    return [];
  }
}

function writeLocalOperations(operations: Operation[]) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(
    OPERATIONS_STORAGE_KEY,
    JSON.stringify(operations)
  );
}

export async function fetchOperations(): Promise<Operation[]> {
  if (isLocalMode()) {
    return readLocalOperations();
  }

  const response = await fetch("/api/operations", {
    method: "GET",
    cache: "no-store",
  });

  return parseResponse<Operation[]>(response);
}

export async function createOperation(
  input: CreateOperationInput
): Promise<Operation> {
  if (isLocalMode()) {
    const operation: Operation = {
      id: crypto.randomUUID(),
      amount: input.amount,
      comment: input.comment ?? null,
      operation_date:
        input.operation_date ?? new Date().toISOString().slice(0, 10),
      asset_category: input.asset_category ?? null,
      created_at: new Date().toISOString(),
      type: input.type,
    };

    const operations = readLocalOperations();
    const nextOperations = [operation, ...operations];

    writeLocalOperations(nextOperations);

    return operation;
  }

  const response = await fetch("/api/operations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return parseResponse<Operation>(response);
}

export async function updateOperation(
  id: string,
  input: UpdateOperationInput
): Promise<Operation> {
  if (isLocalMode()) {
    const operations = readLocalOperations();
    const index = operations.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new Error("Операция не найдена");
    }

    const updated: Operation = {
      ...operations[index],
      amount:
        input.amount !== undefined ? input.amount : operations[index].amount,
      comment:
        input.comment !== undefined ? input.comment : operations[index].comment,
      asset_category:
        input.asset_category !== undefined
          ? input.asset_category
          : operations[index].asset_category,
    };

    const nextOperations = [...operations];
    nextOperations[index] = updated;

    writeLocalOperations(nextOperations);

    return updated;
  }

  const response = await fetch(`/api/operations/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return parseResponse<Operation>(response);
}

export async function deleteOperation(id: string): Promise<void> {
  if (isLocalMode()) {
    const operations = readLocalOperations();
    const nextOperations = operations.filter((item) => item.id !== id);
    writeLocalOperations(nextOperations);
    return;
  }

  const response = await fetch(`/api/operations/${id}`, {
    method: "DELETE",
  });

  await parseResponse<{ ok: true }>(response);
}