import { useEffect, useMemo, useRef, useState } from "react";
import {
  calculateCapital,
  formatNumber,
  formatPercent,
} from "@/lib/calculations";
import {
  DEFAULT_PLAN_SETTINGS,
  fetchPlanSettings,
  upsertPlanSettings,
} from "@/lib/plan";

type SaveStatus = "idle" | "saving" | "saved" | "error";

export function useStrategy() {
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
  const [planStartDate, setPlanStartDate] = useState(
    DEFAULT_PLAN_SETTINGS.planStartDate
  );

  const [portfolioResult, setPortfolioResult] = useState("-");
  const [nominalResult, setNominalResult] = useState("-");
  const [realResult, setRealResult] = useState("-");
  const [errorText, setErrorText] = useState("");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

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
        setPlanStartDate(saved.planStartDate);

        hasLoadedRef.current = true;
      } catch (error) {
        if (!active) return;
        setErrorText(
          error instanceof Error ? error.message : "Ошибка загрузки стратегии"
        );
        setSaveStatus("error");
        hasLoadedRef.current = true;
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, []);

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

    setSaveStatus("saving");

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
        planStartDate,
      })
        .then(() => {
          setSaveStatus("saved");
        })
        .catch((error) => {
          setErrorText(
            error instanceof Error ? error.message : "Ошибка сохранения стратегии"
          );
          setSaveStatus("error");
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
    planStartDate,
  ]);

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
    planStartDate,
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

  function handleManualCalculate() {
    setErrorText("");
    calculateAndSetResult();
  }

  function getSaveStatusText() {
    if (saveStatus === "saving") return "Сохраняется...";
    if (saveStatus === "saved") return "Сохранено";
    if (saveStatus === "error") return "Ошибка сохранения";
    return "";
  }

  function getSaveStatusColor() {
    if (saveStatus === "saving") return "#94a3b8";
    if (saveStatus === "saved") return "#16a34a";
    if (saveStatus === "error") return "#dc2626";
    return "transparent";
  }

  return {
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

    stocksBondsShare,
    setStocksBondsShare,
    stocksBondsReturn,
    setStocksBondsReturn,

    rubCashShare,
    setRubCashShare,
    rubCashReturn,
    setRubCashReturn,

    metalsShare,
    setMetalsShare,
    metalsReturn,
    setMetalsReturn,

    realEstateShare,
    setRealEstateShare,
    realEstateReturn,
    setRealEstateReturn,

    currencyShare,
    setCurrencyShare,
    currencyReturn,
    setCurrencyReturn,

    otherReturn,
    setOtherReturn,
    planStartDate,
    setPlanStartDate,

    portfolioResult,
    nominalResult,
    realResult,
    errorText,
    saveStatus,
    totalManualShare,
    otherShare,
    handleManualCalculate,
    getSaveStatusText,
    getSaveStatusColor,
  };
}