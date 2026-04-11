"use client";

import type { RefObject } from "react";
import type { PlanSettings } from "@/lib/plan";
import type { DistributionMode } from "@/lib/strategy";
import { getYearsWord, buildCompositionItems } from "@/lib/strategy";
import StrategyResultCard from "@/components/strategy/StrategyResultCard";
import StrategyPlanForm from "@/components/strategy/StrategyPlanForm";
import StrategyDistributionCard from "@/components/strategy/StrategyDistributionCard";
import StrategyPortfolioCard from "@/components/strategy/StrategyPortfolioCard";
import StrategyFloatingSummary from "@/components/strategy/StrategyFloatingSummary";

type CompositionItem = ReturnType<typeof buildCompositionItems>[number];

type StrategyScreenViewProps = {
  plan: PlanSettings;
  isLoading: boolean;
  appliedDistributionMode: DistributionMode;
  saveStatusText: string;
  saveStatusColor: string;
  showFloatingSummary: boolean;
  result: {
    success: true;
    portfolioRatePercent: number;
    nominalCapital: number;
    realCapital: number;
  };
  compositionItems: CompositionItem[];
  desktopResultCardRef: RefObject<HTMLDivElement | null>;
  mobileResultCardRef: RefObject<HTMLDivElement | null>;
  onChangePlan: (next: PlanSettings) => void;
  onApplyDistribution: (
    nextPlan: PlanSettings,
    nextMode: DistributionMode
  ) => void;
};

export default function StrategyScreenView({
  plan,
  isLoading,
  appliedDistributionMode,
  saveStatusText,
  saveStatusColor,
  showFloatingSummary,
  result,
  compositionItems,
  desktopResultCardRef,
  mobileResultCardRef,
  onChangePlan,
  onApplyDistribution,
}: StrategyScreenViewProps) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="app-page-title">Стратегия</h1>
        <p className="app-page-subtitle">
          Как ты планируешь накапливать капитал и распределять деньги
        </p>
      </div>

      {!isLoading && (
        <StrategyFloatingSummary
          visible={showFloatingSummary}
          years={plan.years}
          nominalCapital={result.nominalCapital}
          realCapital={result.realCapital}
          getYearsWord={getYearsWord}
        />
      )}

      <section className="flex flex-col gap-4 lg:hidden">
        <div ref={mobileResultCardRef}>
          <StrategyResultCard
            years={plan.years}
            nominalCapital={result.nominalCapital}
            realCapital={result.realCapital}
            getYearsWord={getYearsWord}
          />
        </div>

        <StrategyPlanForm
          plan={plan}
          onChangePlan={onChangePlan}
          saveStatusText={saveStatusText}
          saveStatusColor={saveStatusColor}
        />

        <StrategyDistributionCard
          plan={plan}
          appliedMode={appliedDistributionMode}
          onApplyDistribution={onApplyDistribution}
        />

        <StrategyPortfolioCard
          items={compositionItems}
          portfolioRatePercent={result.portfolioRatePercent}
          inflationPercent={Number(plan.inflation || 0)}
        />
      </section>

      <section className="hidden lg:grid lg:grid-cols-[minmax(0,1.65fr)_minmax(260px,0.75fr)] lg:items-start lg:gap-4">
        <div className="flex flex-col gap-4 min-w-0">
          <StrategyPlanForm
            plan={plan}
            onChangePlan={onChangePlan}
            saveStatusText={saveStatusText}
            saveStatusColor={saveStatusColor}
          />

          <StrategyDistributionCard
            plan={plan}
            appliedMode={appliedDistributionMode}
            onApplyDistribution={onApplyDistribution}
          />
        </div>

        <div className="flex flex-col gap-4 min-w-0">
          <div ref={desktopResultCardRef}>
            <StrategyResultCard
              years={plan.years}
              nominalCapital={result.nominalCapital}
              realCapital={result.realCapital}
              getYearsWord={getYearsWord}
            />
          </div>

          <StrategyPortfolioCard
            items={compositionItems}
            portfolioRatePercent={result.portfolioRatePercent}
            inflationPercent={Number(plan.inflation || 0)}
          />
        </div>
      </section>
    </div>
  );
}