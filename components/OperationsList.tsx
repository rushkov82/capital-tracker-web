"use client";

import { useState } from "react";
import { deleteOperation, updateOperation } from "@/lib/operations";

type Operation = {
  id: string;
  amount: number;
  comment: string | null;
  operation_date: string;
  asset_category: string | null;
  created_at: string;
  type: "income" | "expense";
};

type OperationsListProps = {
  cardClass: string;
  operations: Operation[];
  formatNumber: (value: number) => string;
  onReload?: () => void;
};

export default function OperationsList({
  cardClass,
  operations,
  formatNumber,
  onReload,
}: OperationsListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingAmount, setEditingAmount] = useState("");
  const [editingComment, setEditingComment] = useState("");

  function startEdit(op: Operation) {
    setEditingId(op.id);
    setEditingAmount(String(op.amount));
    setEditingComment(op.comment || "");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingAmount("");
    setEditingComment("");
  }

  async function handleSave(id: string) {
    const amount = Number(editingAmount);

    if (!amount || Number.isNaN(amount) || amount <= 0) {
      return;
    }

    await updateOperation(id, {
      amount,
      comment: editingComment,
    });

    cancelEdit();
    await onReload?.();
  }

  async function handleDelete(id: string) {
    await deleteOperation(id);
    await onReload?.();
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
            const amountColor = isExpense ? "#dc2626" : "#16a34a";
            const amountPrefix = isExpense ? "−" : "+";

            return (
              <div
                key={op.id}
                className={`py-3 ${isLast ? "" : "border-b border-[var(--border)]"}`}
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
                      style={{ color: amountColor }}
                    >
                      {amountPrefix} {formatNumber(op.amount)} ₽
                    </div>
                  )}
                </div>

                <div className="app-text mt-1">
                  {op.asset_category || "Без категории"}
                </div>

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
                      <button onClick={cancelEdit} className="app-text-secondary">
                        Отмена
                      </button>
                      <button onClick={() => handleSave(op.id)} className="app-button">
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
                        className="text-[14px] leading-[20px] text-[#dc2626]"
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