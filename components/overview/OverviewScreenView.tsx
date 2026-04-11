"use client";

import OverviewHeroCard from "@/components/overview/OverviewHeroCard";
import OverviewMonthPlanCard from "@/components/overview/OverviewMonthPlanCard";
import OverviewForecastCard from "@/components/overview/OverviewForecastCard";
import OverviewActionHintCard from "@/components/overview/OverviewActionHintCard";
import OverviewTimeProgressCard from "@/components/overview/OverviewTimeProgressCard";
import OverviewDynamicsCard from "@/components/overview/OverviewDynamicsCard";
import { formatNumber } from "@/lib/calculations";
import type { Operation } from "@/lib/operations";

type OverviewScreenViewProps = {
  totalCapital: number;
  monthlyPlan: number;
  currentMonthFact: number;
  remainingAmount: number;
  heroStatusText: string;
  monthLabel: string;
  forecastStatusText: string;
  actionHintText: string;
  planForecastAmount: number;
  currentForecastAmount: number;
  recentOperations: Operation[];
  tempoAnalysis: {
    explanationText: string;
  };
  timeStats: {
    elapsedMonths: number;
    totalMonths: number;
    progressPercent: number;
  };
};

export default function OverviewScreenView({
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
}: OverviewScreenViewProps) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="app-page-title">Обзор</h1>
        <p className="app-page-subtitle">
          Общая картина накоплений и текущего темпа
        </p>
      </div>

      <div className="grid items-stretch gap-4 xl:grid-cols-5">
        <div className="xl:col-span-1">
          <OverviewHeroCard
            totalCapital={totalCapital}
            timeProgressPercent={timeStats.progressPercent}
            statusText={heroStatusText}
            formatNumber={formatNumber}
          />
        </div>

        <div className="xl:col-span-2">
          <OverviewTimeProgressCard
            elapsedMonths={timeStats.elapsedMonths}
            totalMonths={timeStats.totalMonths}
            progressPercent={timeStats.progressPercent}
          />
        </div>

        <div className="xl:col-span-2">
          <OverviewMonthPlanCard
            monthLabel={monthLabel}
            monthlyPlan={monthlyPlan}
            currentMonthFact={currentMonthFact}
            remainingAmount={remainingAmount}
            formatNumber={formatNumber}
          />
        </div>
      </div>

      <OverviewForecastCard
        planForecastAmount={planForecastAmount}
        currentForecastAmount={currentForecastAmount}
        statusText={forecastStatusText}
        explanationText={tempoAnalysis.explanationText}
        formatNumber={formatNumber}
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <OverviewActionHintCard hintText={actionHintText} />

        <OverviewDynamicsCard
          operations={recentOperations}
          formatNumber={formatNumber}
        />
      </div>
    </div>
  );
}