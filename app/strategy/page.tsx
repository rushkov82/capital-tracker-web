"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  fetchPlanSettings,
  upsertPlanSettings,
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

  const hasLoadedRef = useRef(false);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const saved = await fetchPlanSettings();
        if (!active) return;

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

        hasLoadedRef.current = true;
      } catch (error) {
        if (!active) return;
        setErrorText(
          error instanceof Error ? error.message : "Ошибка загрузки стратегии"
        );
        hasLoadedRef.current = true;
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!hasLoadedRef.current) return;

    const timeout = window.setTimeout(() => {
      void upsertPlanSettings({
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
      }).catch((error) => {
        setErrorText(
          error instanceof Error ? error.message : "Ошибка сохранения стратегии"
        );
      });
    }, 400);

    return () => window.clearTimeout(timeout);
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

  function calculateAndSetResult() {
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
      setPortfolioResult("-");
      setNominalResult("-");
      setRealResult("-");
      setErrorText(result.error);
      return;
    }

    setPortfolioResult(`${formatPercent(result.portfolioRatePercent)} %`);
    setNominalResult(`${formatNumber(result.nominalCapital)} ₽`);
    setRealResult(`${formatNumber(result.realCapital)} ₽`);
  }

  useEffect(() => {
    if (!hasLoadedRef.current) return;

    setErrorText("");
    calculateAndSetResult();
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

  function handleManualCalculate() {
    setErrorText("");
    calculateAndSetResult();
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="app-page-title">Стратегия</h1>
        <p className="app-page-subtitle">
          Сценарий роста капитала, структура и ориентир по результату
        </p>
      </div>

      {errorText && <div className="app-error-box">{errorText}</div>}

      <div className="grid gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-[1.05fr_1.15fr]">
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

      <div className="flex">
        <button onClick={handleManualCalculate} className="app-button">
          Рассчитать
        </button>
      </div>

      <ResultBlock
        cardClass="app-card"
        nominalResult={nominalResult}
        realResult={realResult}
        errorText=""
      />
    </div>
  );
}