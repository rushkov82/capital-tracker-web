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
      <h2 className="app-card-title mb-5">История взносов</h2>

      <div className="space-y-4">
        {operations.length === 0 && (
          <div className="app-list-row">
            <span className="app-text-small">Пока нет записей</span>
          </div>
        )}

        {operations.map((op) => {
          const isEditing = editingId === op.id;

          return (
            <div key={op.id} className="app-list-row">
              {isEditing ? (
                <div className="w-full space-y-4">
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

                  <div className="flex justify-end gap-2">
                    <button onClick={cancelEditing} className="app-button-secondary">
                      Отмена
                    </button>
                    <button onClick={saveEditedOperation} className="app-button-info">
                      Сохранить изменения
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="app-label">
                      {new Date(op.operation_date).toLocaleDateString("ru-RU")}
                    </span>

                    <span className="app-badge">
                      {op.asset_category || "Без категории"}
                    </span>

                    <span className="app-text text-emerald-500">
                      {formatNumber(op.amount)} ₽
                    </span>
                  </div>

                  <div className="app-text-small">
                    {op.comment?.trim() ? op.comment : "Без комментария"}
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => startEditing(op)}
                      className="app-button-secondary"
                    >
                      Исправить
                    </button>
                    <button
                      onClick={() => deleteOperation(op.id)}
                      className="app-button-danger"
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
    <div className="app-form-grid">
      <label className="app-label">{label}</label>
      {children}
    </div>
  );
}