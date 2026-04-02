type CapitalActionsCardProps = {
  amount: string;
  setAmount: (value: string) => void;
  actionType: "income" | "expense" | "adjustment";
  setActionType: (value: "income" | "expense" | "adjustment") => void;
  onSubmit: () => void;
};

export default function CapitalActionsCard({
  amount,
  setAmount,
  actionType,
  setActionType,
  onSubmit,
}: CapitalActionsCardProps) {
  const actionLabel =
    actionType === "income"
      ? "Пополнение"
      : actionType === "expense"
      ? "Вывод"
      : "Переоценка";

  return (
    <section className="app-card">
      <div className="space-y-4">
        <div>
          <h2 className="app-card-title">Действия</h2>
          <div className="app-text-small mt-1">
            Добавь операцию: пополнение, вывод или изменение стоимости
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          <ModeButton
            label="Пополнение"
            isActive={actionType === "income"}
            onClick={() => setActionType("income")}
          />

          <ModeButton
            label="Вывод"
            isActive={actionType === "expense"}
            onClick={() => setActionType("expense")}
          />

          <ModeButton
            label="Переоценка"
            isActive={actionType === "adjustment"}
            onClick={() => setActionType("adjustment")}
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between gap-3">
            <label className="app-label">Сумма</label>
            <span className="app-text-small">{actionLabel}</span>
          </div>

          <input
            className="app-input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onFocus={(e) => e.target.select()}
            placeholder="Например: 10000"
          />
        </div>

        <div className="flex justify-end">
          <button onClick={onSubmit} className="app-button">
            Сохранить
          </button>
        </div>
      </div>
    </section>
  );
}

function ModeButton({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-[14px] border px-4 py-3 text-left text-[14px] font-medium transition"
      style={{
        borderColor: isActive ? "#22c55e" : "var(--border)",
        background: "var(--card)",
      }}
    >
      {label}
    </button>
  );
}