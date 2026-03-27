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
      <h2 className="app-card-title mb-3">Сделать взнос</h2>

      <div className="space-y-3">
        <FormRow label="Сумма пополнения">
          <input
            className={`${commonInputClass} text-[14px] h-[36px]`}
            value={actualContribution}
            onChange={(e) => setActualContribution(e.target.value)}
            placeholder="₽"
          />
        </FormRow>

        <FormRow label="Категория">
          <select
            className={`${selectClass} text-[14px] h-[36px]`}
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
            className={`${commonInputClass} text-[14px] h-[36px]`}
            value={contributionDate}
            onChange={(e) => setContributionDate(e.target.value)}
          />
        </FormRow>

        <FormRow label="Комментарий">
          <input
            className={`${commonInputClass} text-[14px] h-[36px]`}
            value={contributionComment}
            onChange={(e) => setContributionComment(e.target.value)}
            placeholder="например: докупил на просадке"
          />
        </FormRow>

        <div className="flex justify-end pt-2">
          <button
            onClick={onSave}
            className="px-4 h-[36px] text-[14px] rounded-[10px] border border-[var(--border)]"
          >
            Сохранить
          </button>
        </div>
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
      <label className="app-text-small">{label}</label>
      {children}
    </div>
  );
}