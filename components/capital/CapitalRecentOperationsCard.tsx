import type { Operation } from "@/lib/operations";
import { formatNumber } from "@/lib/calculations";

type CapitalRecentOperationsCardProps = {
  operations: Operation[];
};

function getTypeLabel(type: Operation["type"]) {
  if (type === "expense") return "Вывод";
  if (type === "adjustment") return "Переоценка";
  return "Пополнение";
}

export default function CapitalRecentOperationsCard({
  operations,
}: CapitalRecentOperationsCardProps) {
  return (
    <section className="app-card">
      <div className="space-y-4">
        <div>
          <h2 className="app-card-title">Последние операции</h2>
          <div className="app-text-small mt-1">Последние действия с капиталом</div>
        </div>

        {operations.length === 0 ? (
          <div className="app-text-small">Пока нет операций</div>
        ) : (
          <div className="space-y-3">
            {operations.map((operation) => {
              const signedAmount =
                operation.type === "expense"
                  ? -operation.amount
                  : operation.amount;

              const color =
                signedAmount < 0
                  ? "#ef4444"
                  : operation.type === "adjustment"
                  ? "#60a5fa"
                  : "#22c55e";

              return (
                <div
                  key={operation.id}
                  className="flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="text-[14px] font-medium">
                      {getTypeLabel(operation.type)}
                    </div>
                    <div className="app-text-small">
                      {new Date(operation.operation_date).toLocaleDateString(
                        "ru-RU"
                      )}
                      {operation.comment ? ` · ${operation.comment}` : ""}
                    </div>
                  </div>

                  <div
                    className="text-[15px] font-semibold whitespace-nowrap"
                    style={{ color }}
                  >
                    {signedAmount > 0 ? "+" : ""}
                    {formatNumber(signedAmount)} ₽
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}