import {
  PLAN_UPDATED_EVENT,
  createDefaultPlanSettings,
  type PlanSettings,
} from "@/lib/plan";
import type { Operation, OperationType } from "@/lib/operations";

const DEMO_MODE_KEY = "captrack_mode";
const DEMO_PLAN_KEY = "captrack_demo_plan";
const DEMO_OPERATIONS_KEY = "captrack_demo_operations";

function canUseBrowserStorage() {
  return typeof window !== "undefined";
}

export function isDemoMode() {
  if (!canUseBrowserStorage()) return false;
  return window.localStorage.getItem(DEMO_MODE_KEY) === "demo";
}

export function enableDemoMode() {
  if (!canUseBrowserStorage()) return;
  window.localStorage.setItem(DEMO_MODE_KEY, "demo");
}

export function disableDemoMode() {
  if (!canUseBrowserStorage()) return;
  window.localStorage.removeItem(DEMO_MODE_KEY);
}

export function clearDemoStorage() {
  if (!canUseBrowserStorage()) return;
  window.localStorage.removeItem(DEMO_MODE_KEY);
  window.localStorage.removeItem(DEMO_PLAN_KEY);
  window.localStorage.removeItem(DEMO_OPERATIONS_KEY);
}

export function hasDemoData() {
  if (!canUseBrowserStorage()) return false;

  const hasMode = window.localStorage.getItem(DEMO_MODE_KEY) === "demo";
  const hasPlan = Boolean(window.localStorage.getItem(DEMO_PLAN_KEY));
  const hasOperations = Boolean(window.localStorage.getItem(DEMO_OPERATIONS_KEY));

  return hasMode || hasPlan || hasOperations;
}

export function readDemoPlan(): PlanSettings {
  const defaults = createDefaultPlanSettings();

  if (!canUseBrowserStorage()) {
    return defaults;
  }

  try {
    const raw = window.localStorage.getItem(DEMO_PLAN_KEY);
    if (!raw) {
      return defaults;
    }

    const parsed = JSON.parse(raw) as Partial<PlanSettings> | null;
    if (!parsed) {
      return defaults;
    }

    return {
      ...defaults,
      ...parsed,
      planStartDate: parsed.planStartDate || defaults.planStartDate,
    };
  } catch {
    return defaults;
  }
}

export function writeDemoPlan(settings: PlanSettings) {
  if (!canUseBrowserStorage()) return;

  window.localStorage.setItem(DEMO_PLAN_KEY, JSON.stringify(settings));
  window.dispatchEvent(new Event(PLAN_UPDATED_EVENT));
}

export function readDemoOperations(): Operation[] {
  if (!canUseBrowserStorage()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(DEMO_OPERATIONS_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as Operation[] | null;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeDemoOperations(operations: Operation[]) {
  if (!canUseBrowserStorage()) return;
  window.localStorage.setItem(DEMO_OPERATIONS_KEY, JSON.stringify(operations));
}

type DemoOperationInput = {
  amount: number;
  comment?: string | null;
  operation_date?: string;
  asset_category?: string | null;
  type: OperationType;
};

type DemoOperationUpdateInput = {
  amount?: number;
  comment?: string | null;
  operation_date?: string;
  asset_category?: string | null;
  type?: OperationType;
};

type DemoTransferInput = {
  amount: number;
  comment?: string | null;
  operation_date?: string;
  from_asset_category: string;
  to_asset_category: string;
};

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function createDemoOperationRecord(input: DemoOperationInput): Operation {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`,
    amount: input.amount,
    comment: input.comment ?? null,
    operation_date: input.operation_date || todayString(),
    asset_category: input.asset_category ?? null,
    created_at: new Date().toISOString(),
    type: input.type,
  };
}

export function createDemoOperation(input: DemoOperationInput): Operation {
  const operations = readDemoOperations();
  const operation = createDemoOperationRecord(input);

  writeDemoOperations([operation, ...operations]);
  return operation;
}

export function createDemoTransfer(input: DemoTransferInput): Operation[] {
  const operations = readDemoOperations();
  const operationDate = input.operation_date || todayString();
  const comment = input.comment ?? null;

  const expenseOperation = createDemoOperationRecord({
    amount: input.amount,
    comment,
    operation_date: operationDate,
    asset_category: input.from_asset_category,
    type: "expense",
  });

  const incomeOperation = createDemoOperationRecord({
    amount: input.amount,
    comment,
    operation_date: operationDate,
    asset_category: input.to_asset_category,
    type: "income",
  });

  writeDemoOperations([incomeOperation, expenseOperation, ...operations]);

  return [expenseOperation, incomeOperation];
}

export function updateDemoOperation(
  id: string,
  input: DemoOperationUpdateInput
): Operation {
  const operations = readDemoOperations();
  const existing = operations.find((item) => item.id === id);

  if (!existing) {
    throw new Error("Операция не найдена");
  }

  const updated: Operation = {
    ...existing,
    amount: input.amount ?? existing.amount,
    comment: input.comment !== undefined ? input.comment : existing.comment,
    operation_date: input.operation_date ?? existing.operation_date,
    asset_category:
      input.asset_category !== undefined
        ? input.asset_category
        : existing.asset_category,
    type: input.type ?? existing.type,
  };

  writeDemoOperations(
    operations.map((item) => (item.id === id ? updated : item))
  );

  return updated;
}

export function deleteDemoOperation(id: string) {
  const operations = readDemoOperations();
  writeDemoOperations(operations.filter((item) => item.id !== id));
}
