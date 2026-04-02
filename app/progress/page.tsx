"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchPlanSettings, type PlanSettings } from "@/lib/plan";
import { fetchOperations, type Operation } from "@/lib/operations";
import { formatNumber } from "@/lib/calculations";
import ProgressStatusCard from "@/components/progress/ProgressStatusCard";
import PlanVsFactCard from "@/components/progress/PlanVsFactCard";
import ProgressCurrentMonthCard from "@/components/progress/ProgressCurrentMonthCard";
import TimeProgressCard from "@/components/progress/TimeProgressCard";
import ProgressDynamicsCard from "@/components/progress/ProgressDynamicsCard";
import ProgressInsightCard from "@/components/progress/ProgressInsightCard";

export default function ProgressPage() {
  const [plan, setPlan] = useState<PlanSettings | null>(null);
  const [operations, setOperations] = useState<Operation[]>([]);

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    const [planData, operationsData] = await Promise.all([
      fetchPlanSettings(),
      fetchOperations(),
    ]);

    setPlan(planData);
    setOperations(operationsData);
  }

  const totalCapital = useMemo(() => {
    return operations.reduce((sum, operation) => {
      if (operation.type === "expense") return sum - operation.amount;
      return sum + operation.amount;
    }, 0);
  }, [operations]);

  const monthlyPlan = Number(plan?.monthlyContribution || 0);

  const currentMonthFact = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    return operations
      .filter((operation) => {
        if (operation.type === "adjustment") return false;

        const date = new Date(operation.operation_date);
        return date.getFullYear() === year && date.getMonth() === month;
      })
      .reduce((sum, operation) => {
        if (operation.type === "expense") return sum - operation.amount;
        return sum + operation.amount;
      }, 0);
  }, [operations]);

  const currentMonthDifference = currentMonthFact - monthlyPlan;

  const timeStats = useMemo(() => {
    if (!plan) {
      return {
        elapsedMonths: 0,
        totalMonths: 0,
        progressPercent: 0,
      };
    }

    const years = Number(plan.years || 0);
    const totalMonths = years * 12;

    const startDate = new Date(plan.planStartDate);
    const now = new Date();

    const elapsedMonthsRaw =
      (now.getFullYear() - startDate.getFullYear()) * 12 +
      (now.getMonth() - startDate.getMonth());

    const elapsedMonths = Math.max(0, Math.min(totalMonths, elapsedMonthsRaw));

    const progressPercent =
      totalMonths === 0 ? 0 : Math.round((elapsedMonths / totalMonths) * 100);

    return {
      elapsedMonths,
      totalMonths,
      progressPercent,
    };
  }, [plan]);

  const plannedNow = useMemo(() => {
    if (!plan) return 0;

    const monthly = Number(plan.monthlyContribution || 0);
    const growthRate = Number(plan.contributionGrowth || 0) / 100;

    let total = 0;
    let currentMonthly = monthly;

    for (let month = 0; month < timeStats.elapsedMonths; month += 1) {
      total += currentMonthly;

      if ((month + 1) % 12 === 0) {
        currentMonthly *= 1 + growthRate;
      }
    }

    return total;
  }, [plan, timeStats.elapsedMonths]);

  const deviation = totalCapital - plannedNow;

  const statusTitle =
    deviation >= 0
      ? "Ты идёшь по плану"
      : "Ты отстаёшь от плана";

  const recentOperations = useMemo(() => {
    return [...operations]
      .sort((a, b) => {
        const dateCompare = b.operation_date.localeCompare(a.operation_date);
        if (dateCompare !== 0) return dateCompare;
        return b.created_at.localeCompare(a.created_at);
      })
      .slice(0, 5);
  }, [operations]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="app-page-title">Прогресс</h1>
        <p className="app-page-subtitle">
          Насколько твоя реальная жизнь совпадает с тем планом, который ты сам
          себе задал
        </p>
      </div>

      <ProgressStatusCard
        title={statusTitle}
        deviation={deviation}
        formatNumber={formatNumber}
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <PlanVsFactCard
          plannedNow={plannedNow}
          totalCapital={totalCapital}
          deviation={deviation}
          formatNumber={formatNumber}
        />

        <ProgressCurrentMonthCard
          monthlyPlan={monthlyPlan}
          currentMonthFact={currentMonthFact}
          differenceThisMonth={currentMonthDifference}
          formatNumber={formatNumber}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <TimeProgressCard
          elapsedMonths={timeStats.elapsedMonths}
          totalMonths={timeStats.totalMonths}
          progressPercent={timeStats.progressPercent}
        />

        <ProgressInsightCard
          deviation={deviation}
          currentMonthDifference={currentMonthDifference}
          elapsedMonths={timeStats.elapsedMonths}
        />
      </div>

      <ProgressDynamicsCard
        operations={recentOperations}
        formatNumber={formatNumber}
      />
    </div>
  );
}