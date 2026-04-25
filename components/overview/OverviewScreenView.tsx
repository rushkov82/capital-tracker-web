"use client";

import OverviewHeroCard from "@/components/overview/OverviewHeroCard";
import OverviewCategoryDistributionCard from "@/components/overview/OverviewCategoryDistributionCard";
import OverviewMonthPlanCard from "@/components/overview/OverviewMonthPlanCard";
import OverviewForecastCard from "@/components/overview/OverviewForecastCard";
import OverviewActionHintCard from "@/components/overview/OverviewActionHintCard";
import OverviewTimeProgressCard from "@/components/overview/OverviewTimeProgressCard";
import OverviewDynamicsCard from "@/components/overview/OverviewDynamicsCard";
import AuthStatus from "@/components/AuthStatus";
import { formatNumber } from "@/lib/calculations";
import type { Operation } from "@/lib/operations";
import type { StructureItem } from "@/lib/operations-helpers";

type OverviewScreenViewProps = {
  totalCapital: number;
  categoryDistribution: StructureItem[];
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
  categoryDistribution,
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
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="app-page-title">Обзор</h1>
          <p className="app-page-subtitle">
            Общая картина накоплений и текущего темпа
          </p>
        </div>

        <div className="md:hidden shrink-0">
          <AuthStatus />
        </div>
      </div>

      <div className="grid items-stretch gap-4 xl:grid-cols-6">
        <div className="xl:col-span-1">
          <OverviewHeroCard
            totalCapital={totalCapital}
            timeProgressPercent={timeStats.progressPercent}
            statusText={heroStatusText}
            formatNumber={formatNumber}
          />
        </div>

        <div className="xl:col-span-1">
          <OverviewCategoryDistributionCard
            items={categoryDistribution}
            totalCapital={totalCapital}
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
