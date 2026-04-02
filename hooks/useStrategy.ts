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

        setMonthlyContribution(saved.monthlyContribution);
        setInflation(saved.inflation);
        setContributionGrowth(saved.contributionGrowth);
        setYears(saved.years);
        setPlanStartDate(saved.planStartDate);

        hasLoadedRef.current = true;
      } catch {
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
        ...DEFAULT_PLAN_SETTINGS,
        monthlyContribution,
        inflation,
        contributionGrowth,
        years,
        planStartDate,
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
    monthlyContribution,
    inflation,
    contributionGrowth,
    years,
    planStartDate,
  ]);

  useEffect(() => {
    if (!hasLoadedRef.current) return;

    const result = calculateCapital({
      initialCapital: "0",
      monthlyContribution,
      inflation,
      contributionGrowth,
      years,

      stocksBondsShare: "0",
      stocksBondsReturn: "0",
      rubCashShare: "0",
      rubCashReturn: "0",
      metalsShare: "0",
      metalsReturn: "0",
      realEstateShare: "0",
      realEstateReturn: "0",
      currencyShare: "0",
      currencyReturn: "0",
      otherReturn: "0",
    });

    if (!result.success) {
      setErrorText(result.error);
      return;
    }

    setErrorText("");
    setPortfolioResult(`${formatPercent(result.portfolioRatePercent)} %`);
    setNominalResult(`${formatNumber(result.nominalCapital)} ₽`);
    setRealResult(`${formatNumber(result.realCapital)} ₽`);
  }, [monthlyContribution, inflation, contributionGrowth, years]);

  return {
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

    portfolioResult,
    nominalResult,
    realResult,
    errorText,

    saveStatus,
  };
}