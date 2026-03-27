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
        <FormRow label="Начальный капитал">
          <input
            className={commonInputClass}
            value={initialCapital}
            onChange={(e) => setInitialCapital(e.target.value)}
            placeholder="₽"
          />
        </FormRow>

        <FormRow label="Ежемесячный взнос">
          <input
            className={commonInputClass}
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(e.target.value)}
            placeholder="₽"
          />
        </FormRow>

        <FormRow label="Инфляция">
          <input
            className={commonInputClass}
            value={inflation}
            onChange={(e) => setInflation(e.target.value)}
            placeholder="%"
          />
        </FormRow>

        <FormRow label="Индексация взноса">
          <input
            className={commonInputClass}
            value={contributionGrowth}
            onChange={(e) => setContributionGrowth(e.target.value)}
            placeholder="%"
          />
        </FormRow>

        <FormRow label="Срок (лет)">
          <input
            className={commonInputClass}
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
        </FormRow>
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