import { formatNumber, formatPercent } from "@/lib/calculations";

type StrategyResultCardProps = {
  years: string;
  nominalCapital: number;
  realCapital: number;
  portfolioRatePercent: number;
  getYearsWord: (years: number) => string;
};

export default function StrategyResultCard({
  years,
  nominalCapital,
  realCapital,
  portfolioRatePercent,
  getYearsWord,
}: StrategyResultCardProps) {
  return (
    <section className="app-card">
      <div className="app-card-title mb-3">
        Твой капитал через {years} {getYearsWord(Number(years))}
      </div>

      <div className="space-y-4">
        <div>
          <div className="text-sm text-green-400">Будет на счёте</div>
          <div className="text-[28px] font-semibold text-green-500">
            {formatNumber(nominalCapital)} ₽
          </div>
        </div>

        <div>
          <div className="text-sm text-sky-400">В сегодняшних деньгах</div>
          <div className="text-[22px] font-semibold text-sky-500">
            {formatNumber(realCapital)} ₽
          </div>
        </div>

        <div>
          <div className="text-sm text-[var(--muted-foreground)]">
            Средняя доходность портфеля
          </div>
          <div className="text-[18px] font-semibold">
            {formatPercent(portfolioRatePercent)} %
          </div>
        </div>
      </div>
    </section>
  );
}