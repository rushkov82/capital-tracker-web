"use client";

import OverviewScreenView from "@/components/overview/OverviewScreenView";
import { useOverviewController } from "@/components/overview/useOverviewController";

export default function OverviewScreen() {
  const {
    isLoading,
    totalCapital,
    monthlyPlan,
    currentMonthFact,
    remainingAmount,
    heroStatusText,
    monthLabel,
    forecastStatusText,
    actionHintText,
    planForecastAmount,
    currentForecastAmount,
    recentOperations,
    tempoAnalysis,
    timeStats,
  } = useOverviewController();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="app-page-title">Обзор</h1>
          <p className="app-page-subtitle">
            Общая картина накоплений и текущего темпа
          </p>
        </div>

        <section className="app-card">
          <div className="app-text-small">Загружаем данные обзора...</div>
        </section>
      </div>
    );
  }

  return (
    <OverviewScreenView
      totalCapital={totalCapital}
      monthlyPlan={monthlyPlan}
      currentMonthFact={currentMonthFact}
      remainingAmount={remainingAmount}
      heroStatusText={heroStatusText}
      monthLabel={monthLabel}
      forecastStatusText={forecastStatusText}
      actionHintText={actionHintText}
      planForecastAmount={planForecastAmount}
      currentForecastAmount={currentForecastAmount}
      recentOperations={recentOperations}
      tempoAnalysis={tempoAnalysis}
      timeStats={timeStats}
    />
  );
}