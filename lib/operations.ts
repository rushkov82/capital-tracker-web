import { createClient } from "@/lib/supabase/client";

export type Operation = {
  id: string;
  amount: number;
  comment: string | null;
  operation_date: string;
  asset_category: string | null;
  created_at: string;
  type: "income" | "expense";
};

const STORAGE_KEY = "capital_operations";

function readLocalOperations(): Operation[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as Operation[];
  } catch {
    return [];
  }
}

function writeLocalOperations(items: Operation[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

async function getCurrentUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function fetchOperations(): Promise<Operation[]> {
  const user = await getCurrentUser();

  if (!user) {
    return readLocalOperations();
  }

  const supabase = createClient();

  const { data, error } = await supabase
    .from("operations")
    .select("id, amount, comment, date, category, created_at, type")
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((item) => ({
    id: item.id,
    amount: Number(item.amount),
    comment: item.comment,
    operation_date: item.date,
    asset_category: item.category,
    created_at: item.created_at,
    type: (item.type ?? "income") as "income" | "expense",
  }));
}

export async function createOperation(data: {
  amount: number;
  comment: string;
  operation_date: string;
  asset_category: string;
  type: "income" | "expense";
}) {
  const user = await getCurrentUser();

  if (!user) {
    const current = readLocalOperations();

    const newItem: Operation = {
      id: crypto.randomUUID(),
      amount: data.amount,
      comment: data.comment || null,
      operation_date: data.operation_date,
      asset_category: data.asset_category,
      created_at: new Date().toISOString(),
      type: data.type,
    };

    writeLocalOperations([newItem, ...current]);
    return;
  }

  const supabase = createClient();

  const { error } = await supabase.from("operations").insert([
    {
      user_id: user.id,
      amount: data.amount,
      category: data.asset_category,
      date: data.operation_date,
      comment: data.comment || null,
      type: data.type,
    },
  ]);

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateOperation(
  id: string,
  data: {
    amount: number;
    comment: string;
    operation_date?: string;
    asset_category?: string;
    type?: "income" | "expense";
  }
) {
  const user = await getCurrentUser();

  if (!user) {
    const current = readLocalOperations();

    const updated = current.map((item) => {
      if (item.id !== id) return item;

      return {
        ...item,
        amount: data.amount,
        comment: data.comment || null,
        operation_date: data.operation_date ?? item.operation_date,
        asset_category: data.asset_category ?? item.asset_category,
        type: data.type ?? item.type,
      };
    });

    writeLocalOperations(updated);
    return;
  }

  const supabase = createClient();

  const payload: {
    amount: number;
    comment: string | null;
    date?: string;
    category?: string;
    type?: "income" | "expense";
  } = {
    amount: data.amount,
    comment: data.comment || null,
  };

  if (data.operation_date) payload.date = data.operation_date;
  if (data.asset_category) payload.category = data.asset_category;
  if (data.type) payload.type = data.type;

  const { error } = await supabase
    .from("operations")
    .update(payload)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteOperation(id: string) {
  const user = await getCurrentUser();

  if (!user) {
    const current = readLocalOperations();
    writeLocalOperations(current.filter((item) => item.id !== id));
    return;
  }

  const supabase = createClient();

  const { error } = await supabase
    .from("operations")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }
}