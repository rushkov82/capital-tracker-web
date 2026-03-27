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
      {operations.length === 0 ? (
        <div className="app-text-small">Пока нет записей</div>
      ) : (
        <div className="border-t border-[var(--border)] pt-3 space-y-0">
          {operations.map((op, index) => {
            const isLast = index === operations.length - 1;

            return (
              <div
                key={op.id}
                className={`py-3 ${isLast ? "" : "border-b border-[var(--border)]"}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="app-label">
                    {new Date(op.operation_date).toLocaleDateString("ru-RU")}
                  </div>

                  <div className="app-text whitespace-nowrap">
                    {formatNumber(op.amount)} ₽
                  </div>
                </div>

                <div className="app-text mt-1">
                  {op.asset_category || "Без категории"}
                </div>

                <div className="app-text-small mt-0.5">
                  {op.comment?.trim() ? op.comment : "Без комментария"}
                </div>

                <div className="mt-2 flex justify-end gap-3">
                  <button className="app-text-secondary">Исправить</button>
                  <button className="text-[14px] leading-[20px] text-[#dc2626]">
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