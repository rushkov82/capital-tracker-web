type Props = {
  cardClass: string;
  commonInputClass: string;

  initialCapital: string;
  setInitialCapital: (v: string) => void;

  monthlyContribution: string;
  setMonthlyContribution: (v: string) => void;

  inflation: string;
  setInflation: (v: string) => void;

  contributionGrowth: string;
  setContributionGrowth: (v: string) => void;

  years: string;
  setYears: (v: string) => void;

  planStartDate: string;
  setPlanStartDate: (v: string) => void;
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

  planStartDate,
  setPlanStartDate,
}: Props) {
  return (
    <div className={cardClass}>
      <div className="app-card-title">Основные параметры</div>

      <div className="space-y-3">
        <div>
          <div className="app-label">Сколько у тебя есть сейчас</div>
          <input
            className={commonInputClass}
            value={initialCapital}
            onChange={(e) => setInitialCapital(e.target.value)}
            placeholder="0"
          />
          <div className="app-text-small mt-1">Можно начать с нуля</div>
        </div>

        <div>
          <div className="app-label">Ежемесячный взнос</div>
          <input
            className={commonInputClass}
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(e.target.value)}
          />
        </div>

        <div>
          <div className="app-label">Инфляция, %</div>
          <input
            className={commonInputClass}
            value={inflation}
            onChange={(e) => setInflation(e.target.value)}
          />
        </div>

        <div>
          <div className="app-label">Индексация взноса, %</div>
          <input
            className={commonInputClass}
            value={contributionGrowth}
            onChange={(e) => setContributionGrowth(e.target.value)}
          />
        </div>

        <div>
          <div className="app-label">Срок, лет</div>
          <input
            className={commonInputClass}
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
        </div>

        <div>
          <div className="app-label">Дата старта плана</div>
          <input
            type="date"
            className={commonInputClass}
            value={planStartDate}
            onChange={(e) => setPlanStartDate(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}