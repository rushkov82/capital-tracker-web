import { supabase } from "@/lib/supabase";

export type Operation = {
  id: string;
  amount: number;
  comment: string | null;
  operation_date: string;
  asset_category: string | null;
  created_at: string;
};

export type SaveOperationInput = {
  amount: number;
  comment?: string | null;
  operation_date: string;
  asset_category: string;
};

export async function fetchOperations() {
  const { data, error } = await supabase
    .from("operations")
    .select("id, amount, comment, operation_date, asset_category, created_at")
    .order("operation_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data as Operation[]) || [];
}

export async function createOperation(input: SaveOperationInput) {
  const { error } = await supabase.from("operations").insert([
    {
      amount: input.amount,
      comment: input.comment?.trim() || null,
      operation_date: input.operation_date,
      asset_category: input.asset_category,
    },
  ]);

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateOperation(
  id: string,
  input: SaveOperationInput
) {
  const { error } = await supabase
    .from("operations")
    .update({
      amount: input.amount,
      comment: input.comment?.trim() || null,
      operation_date: input.operation_date,
      asset_category: input.asset_category,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function removeOperation(id: string) {
  const { error } = await supabase.from("operations").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}