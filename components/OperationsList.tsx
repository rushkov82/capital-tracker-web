import { useState } from "react";
import { deleteOperation, updateOperation } from "@/lib/operations";

type Operation = {
  id: string;
  amount: number;
  comment: string | null;
  operation_date: string;
  asset_category: string | null;
  created_at: string;
};

type Props = {
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
}: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingAmount, setEditingAmount] = useState("");
  const [editingComment, setEditingComment] = useState("");

  function startEdit(op: Operation) {
    setEditingId(op.id);
    setEditingAmount(String(op.amount));
    setEditingComment(op.comment || "");
  }

  async function saveEdit(id: string) {
    const amount = Number(editingAmount);

    if (!amount || amount <= 0) return;

    await updateOperation(id, {
      amount,
      comment: editingComment,
    });

    setEditingId(null);
    setEditingAmount("");
    setEditingComment("");

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
        <div className="border-t border-[var(--border)] pt-3">
          {operations.map((op, index) => {
            const isLast = index === operations.length - 1;
            const isEditing = editingId === op.id;

            return (
              <div
                key={op.id}
                className={`py-3 ${
                  isLast ? "" : "border-b border-[var(--border)]"
                }`}
              >
                <div className="flex items-center justify-between">
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
                    <div className="app-text">
                      {formatNumber(op.amount)} ₽
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
                        className="app-text-secondary"
                        onClick={() => setEditingId(null)}
                      >
                        Отмена
                      </button>
                      <button
                        className="app-button"
                        onClick={() => saveEdit(op.id)}
                      >
                        Сохранить
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="app-text-secondary"
                        onClick={() => startEdit(op)}
                      >
                        Изменить
                      </button>
                      <button
                        className="text-[14px] text-[#dc2626]"
                        onClick={() => handleDelete(op.id)}
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