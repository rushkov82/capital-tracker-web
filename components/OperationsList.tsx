type Operation = {
  id: string;
  amount: number;
  comment: string | null;
  operation_date: string;
  asset_category: string | null;
  created_at: string;
};

type OperationsListProps = {
  cardClass: string;
  operations: Operation[];
  editingId: string | null;
  editingAmount: string;
  setEditingAmount: (value: string) => void;
  editingComment: string;
  setEditingComment: (value: string) => void;
  editingDate: string;
  setEditingDate: (value: string) => void;
  editingCategory: string;
  setEditingCategory: (value: string) => void;
  categories: string[];
  commonInputClass: string;
  selectClass: string;
  formatNumber: (value: number) => string;
  startEditing: (op: Operation) => void;
  cancelEditing: () => void;
  saveEditedOperation: () => void;
  deleteOperation: (id: string) => void;
};

export default function OperationsList({
  cardClass,
  operations,
  editingId,
  editingAmount,
  setEditingAmount,
  editingComment,
  setEditingComment,
  editingDate,
  setEditingDate,
  editingCategory,
  setEditingCategory,
  categories,
  commonInputClass,
  selectClass,
  formatNumber,
  startEditing,
  cancelEditing,
  saveEditedOperation,
  deleteOperation,
}: OperationsListProps) {
  return (
    <section className={cardClass}>
      <h2 className="app-card-title mb-4">История взносов</h2>

      <div className="space-y-3">
        {operations.length === 0 && (
          <div className="app-text-small">Пока нет записей</div>
        )}

        {operations.map((op, index) => {
          const isEditing = editingId === op.id;
          const isLast = index === operations.length - 1;

          return (
            <div
              key={op.id}
              className={isLast ? "pb-0" : "border-b border-[var(--border)] pb-3"}
            >
              {isEditing ? (
                <div className="space-y-2">
                  <FormRow label="Сумма">
                    <input
                      className={commonInputClass}
                      value={editingAmount}
                      onChange={(e) => setEditingAmount(e.target.value)}
                    />
                  </FormRow>

                  <FormRow label="Категория">
                    <select
                      className={selectClass}
                      value={editingCategory}
                      onChange={(e) => setEditingCategory(e.target.value)}
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </FormRow>

                  <FormRow label="Дата">
                    <input
                      type="date"
                      className={commonInputClass}
                      value={editingDate}
                      onChange={(e) => setEditingDate(e.target.value)}
                    />
                  </FormRow>

                  <FormRow label="Комментарий">
                    <input
                      className={commonInputClass}
                      value={editingComment}
                      onChange={(e) => setEditingComment(e.target.value)}
                    />
                  </FormRow>

                  <div className="mt-2 flex justify-end gap-3">
                    <button
                      onClick={cancelEditing}
                      className="text-[13px] leading-[18px] text-[var(--text-secondary)]"
                    >
                      Отмена
                    </button>
                    <button
                      onClick={saveEditedOperation}
                      className="text-[13px] leading-[18px] text-[#2563eb]"
                    >
                      Сохранить
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="app-label">
                      {new Date(op.operation_date).toLocaleDateString("ru-RU")}
                    </div>

                    <div className="app-text whitespace-nowrap text-emerald-500">
                      {formatNumber(op.amount)} ₽
                    </div>
                  </div>

                  <div className="app-text mt-1">
                    {op.asset_category || "Без категории"}
                  </div>

                  <div className="app-text-small mt-1">
                    {op.comment?.trim() ? op.comment : "Без комментария"}
                  </div>

                  <div className="mt-2 flex justify-end gap-3">
                    <button
                      onClick={() => startEditing(op)}
                      className="text-[13px] leading-[18px] text-[var(--text-secondary)]"
                    >
                      Исправить
                    </button>

                    <button
                      onClick={() => deleteOperation(op.id)}
                      className="text-[13px] leading-[18px] text-[#dc2626]"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FormRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="app-label">{label}</label>
      {children}
    </div>
  );
}