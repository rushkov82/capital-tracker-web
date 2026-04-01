import SegmentedControl from "@/components/ui/SegmentedControl";

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
      <h3 className="app-card-title mb-4">Пополнение или вывод</h3>

      <div className="space-y-3">
        <div className="space-y-2">
          <div className="app-label">Тип операции</div>

          <SegmentedControl
            value={operationType}
            onChange={setOperationType}
            options={[
              { value: "income", label: "Пополнение" },
              { value: "expense", label: "Вывод" },
            ]}
          />

          {isExpense && (
            <div className="app-text-small" style={{ color: "#dc2626" }}>
              Это уменьшит текущий капитал
            </div>
          )}
        </div>

        <FormRow
          label={isIncome ? "Сумма пополнения" : "Сумма вывода"}
          hint="₽"
        >
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