"use client";

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
  const [inflation, setInflation] = useState(
    DEFAULT_PLAN_SETTINGS.inflation
  );
  const [contributionGrowth, setContributionGrowth] = useState(
    DEFAULT_PLAN_SETTINGS.contributionGrowth
  );
  const [years, setYears] = useState(DEFAULT_PLAN_SETTINGS.years);

  const [planStartDate, setPlanStartDate] = useState(
    DEFAULT_PLAN_SETTINGS.planStartDate
  );

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
        setPlanStartDate(saved.planStartDate);

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
        setErrorText("Ошибка загрузки стратегии");
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

    setSaveStatus("saving");

    const timeout = window.setTimeout(() => {
      void upsertPlanSettings({
        initialCapital,
        monthlyContribution,
        inflation,
        contributionGrowth,
        years,
        planStartDate,
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
      })
        .then(() => {
          setSaveStatus("saved");
          setTimeout(() => setSaveStatus("idle"), 1500);
        })
        .catch(() => {
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
    planStartDate,
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

  useEffect(() => {
    if (!hasLoadedRef.current) return;

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

    setErrorText("");
    setPortfolioResult(`${formatPercent(result.portfolioRatePercent)} %`);
    setNominalResult(`${formatNumber(result.nominalCapital)} ₽`);
    setRealResult(`${formatNumber(result.realCapital)} ₽`);
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

  function getSaveStatusText() {
    if (saveStatus === "saving") return "Сохраняем...";
    if (saveStatus === "saved") return "Сохранено";
    if (saveStatus === "error") return "Ошибка";
    return "";
  }

  function getSaveStatusColor() {
    if (saveStatus === "saving") return "#9ca3af";
    if (saveStatus === "saved") return "#16a34a";
    if (saveStatus === "error") return "#dc2626";
    return "#9ca3af";
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
    planStartDate,
    setPlanStartDate,

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

    otherShare,
    otherReturn,
    setOtherReturn,

    totalManualShare,

    portfolioResult,
    nominalResult,
    realResult,
    errorText,

    saveStatus,
    getSaveStatusText,
    getSaveStatusColor,
  };
}