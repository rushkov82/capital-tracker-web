"use client";

import { useState } from "react";
import { deleteOperation, updateOperation } from "@/lib/operations";
import { showToast } from "@/lib/toast";

type Operation = {
  id: string;
  amount: number;
  comment: string | null;
  operation_date: string;
  asset_category: string | null;
  created_at: string;
  type: "income" | "expense" | "adjustment";
};

type OperationsListProps = {
  cardClass: string;
  operations: Operation[];
  categories: string[];
  formatNumber: (value: number) => string;
  onReload?: () => Promise<void> | void;
};

export default function OperationsList({
  cardClass,
  operations,
  categories,
  formatNumber,
  onReload,
}: OperationsListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingAmount, setEditingAmount] = useState("");
  const [editingComment, setEditingComment] = useState("");
  const [editingCategory, setEditingCategory] = useState("");

  function startEdit(op: Operation) {
    setEditingId(op.id);
    setEditingAmount(String(op.amount));
    setEditingComment(op.comment || "");
    setEditingCategory(op.asset_category || categories[0] || "");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingAmount("");
    setEditingComment("");
    setEditingCategory("");
  }

  async function handleSave(id: string) {
    const amount = Number(editingAmount);

    if (!amount || Number.isNaN(amount)) {
      showToast({
        type: "error",
        title: "Не удалось сохранить",
        description: "Введите корректную сумму",
      });
      return;
    }

    try {
      await updateOperation(id, {
        amount,
        comment: editingComment,
        asset_category: editingCategory,
      });

      cancelEdit();
      await onReload?.();
    } catch (error) {
      showToast({
        type: "error",
        title: "Не удалось сохранить",
        description:
          error instanceof Error ? error.message : "Ошибка сохранения операции",
      });
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteOperation(id);
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
            const isEditing = editingId === op.id;

            const isExpense = op.type === "expense";
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
                    {new Date(op.operation_date).toLocaleDateString("ru-RU")}
                  </div>

                  {isEditing ? (
                    <input
                      className="app-input w-[120px] text-right"
                      value={editingAmount}
                      onChange={(e) => setEditingAmount(e.target.value)}
                    />
                  ) : (
                    <div
                      className="app-text whitespace-nowrap font-semibold"
                      style={{ color }}
                    >
                      {prefix} {formatNumber(Math.abs(op.amount))} ₽
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="mt-2">
                    <select
                      className="app-select"
                      value={editingCategory}
                      onChange={(e) => setEditingCategory(e.target.value)}
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="app-text mt-1">
                    {isAdjustment
                      ? op.asset_category || "Корректировка"
                      : op.asset_category || "Без категории"}
                  </div>
                )}

                {isEditing ? (
                  <input
                    className="app-input mt-2"
                    value={editingComment}
                    onChange={(e) => setEditingComment(e.target.value)}
                    placeholder="Комментарий"
                  />
                ) : (
                  <div className="app-text-small mt-0.5">
                    {op.comment?.trim() ? op.comment : "Без комментария"}
                  </div>
                )}

                <div className="mt-2 flex justify-end gap-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={cancelEdit}
                        className="app-text-secondary"
                      >
                        Отмена
                      </button>
                      <button
                        onClick={() => handleSave(op.id)}
                        className="app-button"
                      >
                        Сохранить
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(op)}
                        className="app-text-secondary"
                      >
                        Изменить
                      </button>
                      <button
                        onClick={() => handleDelete(op.id)}
                        className="text-[14px] text-[#dc2626]"
                      >
                        Удалить
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}