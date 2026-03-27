type MainParametersProps = {
  cardClass: string;
  commonInputClass: string;
  initialCapital: string;
  setInitialCapital: (value: string) => void;
  monthlyContribution: string;
  setMonthlyContribution: (value: string) => void;
  inflation: string;
  setInflation: (value: string) => void;
  contributionGrowth: string;
  setContributionGrowth: (value: string) => void;
  years: string;
  setYears: (value: string) => void;
};

export default function MainParameters({
  cardClass,
  commonInputClass,
  initialCapital,
  setInitialCapital,
  monthlyContribution,
  setMonthlyContribution,
  inflation,
  setInflation,
  contributionGrowth,
  setContributionGrowth,
  years,
  setYears,
}: MainParametersProps) {
  return (
    <section className={cardClass}>
      <h2 className="app-card-title mb-4">Основные параметры</h2>

      <div className="space-y-3">
        <FormRow label="Начальный капитал" hint="₽">
          <input
            className={commonInputClass}
            value={initialCapital}
            onChange={(e) => setInitialCapital(e.target.value)}
            placeholder="Например: 0"
          />
        </FormRow>

        <FormRow label="Ежемесячный взнос" hint="₽">
          <input
            className={commonInputClass}
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(e.target.value)}
            placeholder="Например: 50000"
          />
        </FormRow>

        <FormRow label="Инфляция" hint="%">
          <input
            className={commonInputClass}
            value={inflation}
            onChange={(e) => setInflation(e.target.value)}
            placeholder="Например: 9"
          />
        </FormRow>

        <FormRow label="Индексация взноса" hint="%">
          <input
            className={commonInputClass}
            value={contributionGrowth}
            onChange={(e) => setContributionGrowth(e.target.value)}
            placeholder="Например: 10"
          />
        </FormRow>

        <FormRow label="Срок" hint="лет">
          <input
            className={commonInputClass}
            value={years}
            onChange={(e) => setYears(e.target.value)}
            placeholder="Например: 10"
          />
        </FormRow>
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
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-3">
        <label className="app-label">{label}</label>
        <span className="app-text-small">{hint}</span>
      </div>
      {children}
    </div>
  );
}