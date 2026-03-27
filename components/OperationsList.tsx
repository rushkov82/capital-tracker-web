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
  formatNumber: (value: number) => string;
};

export default function OperationsList({
  cardClass,
  operations,
  formatNumber,
}: OperationsListProps) {
  return (
    <div className={cardClass}>
      <div className="space-y-3">
        {operations.map((op, index) => {
          const isLast = index === operations.length - 1;

          return (
            <div
              key={op.id}
              className={isLast ? "" : "border-b border-[var(--border)] pb-2"}
            >
              <div className="flex justify-between">
                <span className="app-label">
                  {new Date(op.operation_date).toLocaleDateString("ru-RU")}
                </span>

                <span className="app-text">
                  {formatNumber(op.amount)} ₽
                </span>
              </div>

              <div className="app-text">{op.asset_category}</div>

              <div className="app-text-small">
                {op.comment || "Без комментария"}
              </div>

              <div className="flex justify-end gap-3 mt-1">
                <button className="app-button">Исправить</button>
                <button className="app-button app-button-danger">
                  Удалить
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}