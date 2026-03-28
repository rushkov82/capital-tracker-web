type ContributionFormProps = {
  cardClass: string;
  commonInputClass: string;
  selectClass: string;
  categories: string[];
  actualContribution: string;
  setActualContribution: (value: string) => void;
  contributionCategory: string;
  setContributionCategory: (value: string) => void;
  contributionDate: string;
  setContributionDate: (value: string) => void;
  contributionComment: string;
  setContributionComment: (value: string) => void;
  operationType: "income" | "expense";
  setOperationType: (value: "income" | "expense") => void;
  onSave: () => void;
};

export default function ContributionForm({
  cardClass,
  commonInputClass,
  selectClass,
  categories,
  actualContribution,
  setActualContribution,
  contributionCategory,
  setContributionCategory,
  contributionDate,
  setContributionDate,
  contributionComment,
  setContributionComment,
  operationType,
  setOperationType,
  onSave,
}: ContributionFormProps) {
  const isIncome = operationType === "income";
  const isExpense = operationType === "expense";

  return (
    <section className={cardClass}>
      <h2 className="app-card-title mb-4">
        {isIncome ? "Сделать взнос" : "Вывод средств"}
      </h2>

      <div className="space-y-3">
        <div className="space-y-2">
          <div className="app-label">Тип операции</div>

          <div className="inline-flex rounded-[10px] border border-[var(--border)] p-1">
            <button
              type="button"
              onClick={() => setOperationType("income")}
              className={
                isIncome
                  ? "h-[34px] px-4 rounded-[8px] bg-[var(--card)] border border-[var(--border)] text-[14px] font-medium text-[var(--text-primary)]"
                  : "h-[34px] px-4 rounded-[8px] text-[14px] font-medium text-[var(--text-secondary)]"
              }
            >
              Пополнение
            </button>

            <button
              type="button"
              onClick={() => setOperationType("expense")}
              className={
                isExpense
                  ? "h-[34px] px-4 rounded-[8px] bg-[var(--card)] border border-[var(--border)] text-[14px] font-medium text-[var(--text-primary)]"
                  : "h-[34px] px-4 rounded-[8px] text-[14px] font-medium text-[var(--text-secondary)]"
              }
            >
              Вывод
            </button>
          </div>

          {isExpense && (
            <div className="app-text-small" style={{ color: "#dc2626" }}>
              Это уменьшит текущий капитал
            </div>
          )}
        </div>

        <FormRow label={isIncome ? "Сумма пополнения" : "Сумма вывода"} hint="₽">
          <input
            className={commonInputClass}
            value={actualContribution}
            onChange={(e) => setActualContribution(e.target.value)}
            placeholder={isIncome ? "Например: 10000" : "Например: 5000"}
          />
        </FormRow>

        <FormRow label="Категория">
          <select
            className={selectClass}
            value={contributionCategory}
            onChange={(e) => setContributionCategory(e.target.value)}
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
            value={contributionDate}
            onChange={(e) => setContributionDate(e.target.value)}
          />
        </FormRow>

        <FormRow label="Комментарий" hint="необязательно">
          <input
            className={commonInputClass}
            value={contributionComment}
            onChange={(e) => setContributionComment(e.target.value)}
            placeholder={
              isIncome
                ? "Например: докупил на просадке"
                : "Например: вывел на личные расходы"
            }
          />
        </FormRow>

        <div className="flex justify-end pt-2">
          <button onClick={onSave} className="app-button">
            Сохранить
          </button>
        </div>
      </div>
    </section>
  );
}

function FormRow({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-3">
        <label className="app-label">{label}</label>
        {hint ? <span className="app-text-small">{hint}</span> : <span />}
      </div>
      {children}
    </div>
  );
}