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
  operation_date?: string;
  asset_category?: string | null;
  type?: OperationType;
};

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || "Ошибка запроса");
  }

  return data;
}

export async function fetchOperations(): Promise<Operation[]> {
  const response = await fetch("/api/operations", {
    method: "GET",
    cache: "no-store",
  });

  return parseResponse<Operation[]>(response);
}

export async function createOperation(
  input: CreateOperationInput
): Promise<Operation> {
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
  const response = await fetch(`/api/operations/${id}`, {
    method: "DELETE",
  });

  await parseResponse<{ ok: true }>(response);
}