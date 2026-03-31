"use client";

import MainParameters from "@/components/MainParameters";
import PortfolioStructure from "@/components/PortfolioStructure";
import ResultBlock from "@/components/ResultBlock";
import { useStrategy } from "@/hooks/useStrategy";

export default function StrategyPage() {
  const s = useStrategy();

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="app-page-title">Стратегия</h1>
          <p className="app-page-subtitle">
            Сценарий роста капитала, структура и ориентир по результату
          </p>
        </div>

        {s.saveStatus !== "idle" && (
          <div
            className="text-[13px] leading-[18px] whitespace-nowrap pt-1"
            style={{ color: s.getSaveStatusColor() }}
          >
            {s.getSaveStatusText()}
          </div>
        )}
      </div>

      {s.errorText && <div className="app-error-box">{s.errorText}</div>}

      <div className="grid gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-[1.05fr_1.15fr]">
        <MainParameters
          cardClass="app-card"
          commonInputClass="app-input"
          initialCapital={s.initialCapital}
          setInitialCapital={s.setInitialCapital}
          monthlyContribution={s.monthlyContribution}
          setMonthlyContribution={s.setMonthlyContribution}
          inflation={s.inflation}
          setInflation={s.setInflation}
          contributionGrowth={s.contributionGrowth}
          setContributionGrowth={s.setContributionGrowth}
          years={s.years}
          setYears={s.setYears}
        />

        <PortfolioStructure
          cardClass="app-card"
          commonInputClass="app-input"
          stocksBondsShare={s.stocksBondsShare}
          setStocksBondsShare={s.setStocksBondsShare}
          stocksBondsReturn={s.stocksBondsReturn}
          setStocksBondsReturn={s.setStocksBondsReturn}
          rubCashShare={s.rubCashShare}
          setRubCashShare={s.setRubCashShare}
          rubCashReturn={s.rubCashReturn}
          setRubCashReturn={s.setRubCashReturn}
          metalsShare={s.metalsShare}
          setMetalsShare={s.setMetalsShare}
          metalsReturn={s.metalsReturn}
          setMetalsReturn={s.setMetalsReturn}
          realEstateShare={s.realEstateShare}
          setRealEstateShare={s.setRealEstateShare}
          realEstateReturn={s.realEstateReturn}
          setRealEstateReturn={s.setRealEstateReturn}
          currencyShare={s.currencyShare}
          setCurrencyShare={s.setCurrencyShare}
          currencyReturn={s.currencyReturn}
          setCurrencyReturn={s.setCurrencyReturn}
          otherShare={s.otherShare}
          otherReturn={s.otherReturn}
          setOtherReturn={s.setOtherReturn}
          totalShare={s.totalManualShare + Math.max(s.otherShare, 0)}
          portfolioResult={s.portfolioResult}
        />
      </div>

      <div className="flex">
        <button onClick={s.handleManualCalculate} className="app-button">
          Рассчитать
        </button>
      </div>

      <ResultBlock
        cardClass="app-card"
        nominalResult={s.nominalResult}
        realResult={s.realResult}
        errorText=""
      />
    </div>
  );
}