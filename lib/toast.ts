export type ToastType = "success" | "error" | "info";

export type ToastItem = {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
};

type Listener = (items: ToastItem[]) => void;

let items: ToastItem[] = [];
const listeners = new Set<Listener>();

function emit() {
  for (const listener of listeners) {
    listener(items);
  }
}

export function subscribeToToasts(listener: Listener) {
  listeners.add(listener);
  listener(items);

  return () => {
    listeners.delete(listener);
  };
}

export function showToast(input: Omit<ToastItem, "id">) {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`;

  items = [...items, { id, ...input }];
  emit();

  return id;
}

export function dismissToast(id: string) {
  items = items.filter((item) => item.id !== id);
  emit();
}