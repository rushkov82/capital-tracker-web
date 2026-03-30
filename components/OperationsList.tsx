"use client";

import { deleteOperation, type Operation } from "@/lib/operations";
import { showToast } from "@/lib/toast";

type OperationsListProps = {
  cardClass: string;
  operations: Operation[];
  categories: string[];
  formatNumber: (value: number) => string;
  onReload?: () => Promise<void> | void;
};

function getTypeLabel(type: Operation["type"]) {
  if (type === "expense") return "Расход";
  if (type === "adjustment") return "Корректировка";
  return "Пополнение";
}

export default function OperationsList({
  cardClass,
  operations,
  formatNumber,
  onReload,
}: OperationsListProps) {
  async function handleDelete(id: string) {
    try {
      deleteOperation(id);
      await onReload?.();
    } catch (error) {
      showToast({
        type: "error",
        title: "Не удалось удалить",
        description:
          error instanceof Error ? error.message : "Ошибка удаления операции",
      });
    }
  }

  return (
    <div className={cardClass}>
      {operations.length === 0 ? (
        <div className="app-text-small">Пока нет записей</div>
      ) : (
        <div className="border-t border-[var(--border)] pt-3 space-y-0">
          {operations.map((op, index) => {
            const isLast = index === operations.length - 1;
            const isAdjustment = op.type === "adjustment";
            const signed = op.type === "expense" ? -op.amount : op.amount;

            const color =
              signed < 0
                ? "#dc2626"
                : isAdjustment
                ? "#2563eb"
                : "#16a34a";

            const prefix = signed < 0 ? "−" : "+";

            return (
              <div
                key={op.id}
                className={`py-3 ${
                  isLast ? "" : "border-b border-[var(--border)]"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="app-label">
                    {new Date(op.created_at).toLocaleDateString("ru-RU")}
                  </div>

                  <div
                    className="app-text whitespace-nowrap font-semibold"
                    style={{ color }}
                  >
                    {prefix} {formatNumber(Math.abs(op.amount))} ₽
                  </div>
                </div>

                <div className="app-text mt-1">{getTypeLabel(op.type)}</div>

                <div className="app-text-small mt-0.5">
                  {op.comment?.trim() ? op.comment : "Без комментария"}
                </div>

                <div className="mt-2 flex justify-end gap-3">
                  <button
                    onClick={() => handleDelete(op.id)}
                    className="text-[14px] text-[#dc2626]"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}