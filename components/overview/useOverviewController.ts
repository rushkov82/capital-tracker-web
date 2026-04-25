"use client";

import { useMemo } from "react";
import { formatNumber } from "@/lib/calculations";
import {
  buildStructureFromOperations,
  buildRecentOperations,
  calculateTotalCapital,
} from "@/lib/operations-helpers";
import {
  getActionHintText,
  getCurrentMonthFact,
  getCurrentTempoAnalysis,
  getForecastAmounts,
  getForecastStatusText,
  getMonthLabel,
  getMonthLabelGenitive,
  getOverviewHeroStatusText,
  getPlannedNow,
  getTimeStats,
} from "@/lib/overview-helpers";
import { useCoreData } from "@/components/core/CoreDataProvider";

export function useOverviewController() {
  const { plan, operations, isLoading } = useCoreData();

  const totalCapital = useMemo(() => {
    return calculateTotalCapital(operations);
  }, [operations]);

  const categoryDistribution = useMemo(() => {
    return buildStructureFromOperations(operations).filter(
      (item) => item.amount > 0
    );
  }, [operations]);

  const monthlyPlan = Number(plan?.monthlyContribution || 0);

  const currentMonthFact = useMemo(() => {
    return getCurrentMonthFact(operations);
  }, [operations]);

  const remainingAmount = Math.max(0, monthlyPlan - currentMonthFact);

  const timeStats = useMemo(() => {
    return getTimeStats(plan);
  }, [plan]);

  const plannedNow = useMemo(() => {
    return getPlannedNow({
      plan,
      elapsedMonths: timeStats.elapsedMonths,
    });
  }, [plan, timeStats.elapsedMonths]);

  const deviation = totalCapital - plannedNow;

  const heroStatusText = useMemo(() => {
    return getOverviewHeroStatusText(deviation);
  }, [deviation]);

  const monthLabel = useMemo(() => {
    return getMonthLabel();
  }, []);

  const monthLabelGenitive = useMemo(() => {
    return getMonthLabelGenitive();
  }, []);

  const tempoAnalysis = useMemo(() => {
    return getCurrentTempoAnalysis({
      operations,
      monthlyPlan,
    });
  }, [operations, monthlyPlan]);

  const { planForecastAmount, currentForecastAmount } = useMemo(() => {
    return getForecastAmounts({
      plan,
      currentMonthlyTempo: tempoAnalysis.currentMonthlyTempo,
    });
  }, [plan, tempoAnalysis.currentMonthlyTempo]);

  const forecastStatusText = useMemo(() => {
    return getForecastStatusText({
      planForecastAmount,
      currentForecastAmount,
    });
  }, [planForecastAmount, currentForecastAmount]);

  const actionHintText = useMemo(() => {
    return getActionHintText({
      monthlyPlan,
      remainingAmount,
      deviation,
      monthLabelGenitive,
      formatNumber,
    });
  }, [monthlyPlan, remainingAmount, deviation, monthLabelGenitive]);

  const recentOperations = useMemo(() => {
    return buildRecentOperations(operations, 3);
  }, [operations]);

  return {
    isLoading,
    totalCapital,
    categoryDistribution,
    monthlyPlan,
    currentMonthFact,
    remainingAmount,
    timeStats,
    heroStatusText,
    monthLabel,
    tempoAnalysis,
    planForecastAmount,
    currentForecastAmount,
    forecastStatusText,
    actionHintText,
    recentOperations,
  };
}
