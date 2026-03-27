"use client";

import { useEffect, useMemo, useState } from "react";
import {
  calculateCapital,
  formatNumber,
  formatPercent,
} from "@/lib/calculations";
import MainParameters from "@/components/MainParameters";
import PortfolioStructure from "@/components/PortfolioStructure";
import ResultBlock from "@/components/ResultBlock";
import {
  DEFAULT_PLAN_SETTINGS,
  loadPlanSettings,
  savePlanSettings,
} from "@/lib/plan";

export default function StrategyPage() {
  const [initialCapital, setInitialCapital] = useState(
    DEFAULT_PLAN_SETTINGS.initialCapital
  );
  const [monthlyContribution, setMonthlyContribution] = useState(
    DEFAULT_PLAN_SETTINGS.monthlyContribution
  );
  const [inflation, setInflation] = useState(DEFAULT_PLAN_SETTINGS.inflation);
  const [contributionGrowth, setContributionGrowth] = useState(
    DEFAULT_PLAN_SETTINGS.contributionGrowth
  );
  const [years, setYears] = useState(DEFAULT_PLAN_SETTINGS.years);

  const [stocksBondsShare, setStocksBondsShare] = useState(
    DEFAULT_PLAN_SETTINGS.stocksBondsShare
  );
  const [stocksBondsReturn, setStocksBondsReturn] = useState(
    DEFAULT_PLAN_SETTINGS.stocksBondsReturn
  );

  const [rubCashShare, setRubCashShare] = useState(
    DEFAULT_PLAN_SETTINGS.rubCashShare
  );
  const [rubCashReturn, setRubCashReturn] = useState(
    DEFAULT_PLAN_SETTINGS.rubCashReturn
  );

  const [metalsShare, setMetalsShare] = useState(
    DEFAULT_PLAN_SETTINGS.metalsShare
  );
  const [metalsReturn, setMetalsReturn] = useState(
    DEFAULT_PLAN_SETTINGS.metalsReturn
  );

  const [realEstateShare, setRealEstateShare] = useState(
    DEFAULT_PLAN_SETTINGS.realEstateShare
  );
  const [realEstateReturn, setRealEstateReturn] = useState(
    DEFAULT_PLAN_SETTINGS.realEstateReturn
  );

  const [currencyShare, setCurrencyShare] = useState(
    DEFAULT_PLAN_SETTINGS.currencyShare
  );
  const [currencyReturn, setCurrencyReturn] = useState(
    DEFAULT_PLAN_SETTINGS.currencyReturn
  );

  const [otherReturn, setOtherReturn] = useState(
    DEFAULT_PLAN_SETTINGS.otherReturn
  );

  const [portfolioResult, setPortfolioResult] = useState("-");
  const [nominalResult, setNominalResult] = useState("-");
  const [realResult, setRealResult] = useState("-");
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    const saved = loadPlanSettings();

    setInitialCapital(saved.initialCapital);
    setMonthlyContribution(saved.monthlyContribution);
    setInflation(saved.inflation);
    setContributionGrowth(saved.contributionGrowth);
    setYears(saved.years);

    setStocksBondsShare(saved.stocksBondsShare);
    setStocksBondsReturn(saved.stocksBondsReturn);

    setRubCashShare(saved.rubCashShare);
    setRubCashReturn(saved.rubCashReturn);

    setMetalsShare(saved.metalsShare);
    setMetalsReturn(saved.metalsReturn);

    setRealEstateShare(saved.realEstateShare);
    setRealEstateReturn(saved.realEstateReturn);

    setCurrencyShare(saved.currencyShare);
    setCurrencyReturn(saved.currencyReturn);

    setOtherReturn(saved.otherReturn);
  }, []);

  useEffect(() => {
    savePlanSettings({
      initialCapital,
      monthlyContribution,
      inflation,
      contributionGrowth,
      years,
      stocksBondsShare,
      stocksBondsReturn,
      rubCashShare,
      rubCashReturn,
      metalsShare,
      metalsReturn,
      realEstateShare,
      realEstateReturn,
      currencyShare,
      currencyReturn,
      otherReturn,
    });
  }, [
    initialCapital,
    monthlyContribution,
    inflation,
    contributionGrowth,
    years,
    stocksBondsShare,
    stocksBondsReturn,
    rubCashShare,
    rubCashReturn,
    metalsShare,
    metalsReturn,
    realEstateShare,
    realEstateReturn,
    currencyShare,
    currencyReturn,
    otherReturn,
  ]);

  const totalManualShare = useMemo(() => {
    return (
      (Number(stocksBondsShare) || 0) +
      (Number(rubCashShare) || 0) +
      (Number(metalsShare) || 0) +
      (Number(realEstateShare) || 0) +
      (Number(currencyShare) || 0)
    );
  }, [
    stocksBondsShare,
    rubCashShare,
    metalsShare,
    realEstateShare,
    currencyShare,
  ]);

  const otherShare = useMemo(() => {
    return 100 - totalManualShare;
  }, [totalManualShare]);

  function calculate() {
    setErrorText("");

    const result = calculateCapital({
      initialCapital,
      monthlyContribution,
      inflation,
      contributionGrowth,
      years,
      stocksBondsShare,
      stocksBondsReturn,
      rubCashShare,
      rubCashReturn,
      metalsShare,
      metalsReturn,
      realEstateShare,
      realEstateReturn,
      currencyShare,
      currencyReturn,
      otherReturn,
    });

    if (!result.success) {
      setErrorText(result.error);
      return;
    }

    setPortfolioResult(`${formatPercent(result.portfolioRatePercent)} %`);
    setNominalResult(`${formatNumber(result.nominalCapital)} ₽`);
    setRealResult(`${formatNumber(result.realCapital)} ₽`);
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="app-page-title">Стратегия</h1>
        <p className="app-page-subtitle">
          Сценарий роста капитала, структура и ориентир по результату
        </p>
      </div>

      <div className="grid gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2">
        <MainParameters
          cardClass="app-card"
          commonInputClass="app-input"
          initialCapital={initialCapital}
          setInitialCapital={setInitialCapital}
          monthlyContribution={monthlyContribution}
          setMonthlyContribution={setMonthlyContribution}
          inflation={inflation}
          setInflation={setInflation}
          contributionGrowth={contributionGrowth}
          setContributionGrowth={setContributionGrowth}
          years={years}
          setYears={setYears}
        />

        <div className="space-y-4">
          <div className="flex">
            <button onClick={calculate} className="app-button">
              Рассчитать
            </button>
          </div>

          <PortfolioStructure
            cardClass="app-card"
            commonInputClass="app-input"
            stocksBondsShare={stocksBondsShare}
            setStocksBondsShare={setStocksBondsShare}
            stocksBondsReturn={stocksBondsReturn}
            setStocksBondsReturn={setStocksBondsReturn}
            rubCashShare={rubCashShare}
            setRubCashShare={setRubCashShare}
            rubCashReturn={rubCashReturn}
            setRubCashReturn={setRubCashReturn}
            metalsShare={metalsShare}
            setMetalsShare={setMetalsShare}
            metalsReturn={metalsReturn}
            setMetalsReturn={setMetalsReturn}
            realEstateShare={realEstateShare}
            setRealEstateShare={setRealEstateShare}
            realEstateReturn={realEstateReturn}
            setRealEstateReturn={setRealEstateReturn}
            currencyShare={currencyShare}
            setCurrencyShare={setCurrencyShare}
            currencyReturn={currencyReturn}
            setCurrencyReturn={setCurrencyReturn}
            otherShare={otherShare}
            otherReturn={otherReturn}
            setOtherReturn={setOtherReturn}
            totalShare={totalManualShare + Math.max(otherShare, 0)}
            portfolioResult={portfolioResult}
          />
        </div>
      </div>

      <ResultBlock
        cardClass="app-card"
        nominalResult={nominalResult}
        realResult={realResult}
        errorText={errorText}
      />
    </div>
  );
}