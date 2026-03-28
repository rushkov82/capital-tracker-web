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
  onSave,
}: ContributionFormProps) {
  return (
    <section className={cardClass}>
      <h2 className="app-card-title mb-4">Сделать взнос</h2>

      <div className="space-y-3">
        <FormRow label="Сумма пополнения" hint="₽">
          <input
            className={commonInputClass}
            value={actualContribution}
            onChange={(e) => setActualContribution(e.target.value)}
            placeholder="Например: 10000"
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
            placeholder="Например: докупил на просадке"
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