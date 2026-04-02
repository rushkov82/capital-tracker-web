"use client";

import { useEffect, useMemo, useState } from "react";
import OverviewCards from "@/components/overview/OverviewCards";
import OverviewMonthBlock from "@/components/overview/OverviewMonthBlock";
import OverviewRecentActions from "@/components/overview/OverviewRecentActions";
import OverviewAuthorNote from "@/components/overview/OverviewAuthorNote";
import { fetchPlanSettings, type PlanSettings } from "@/lib/plan";
import { fetchOperations, type Operation } from "@/lib/operations";
import { formatNumber } from "@/lib/calculations";

export default function OverviewPage() {
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

  const monthlyPlan = Number(plan?.monthlyContribution || 0);
  const currentMonthDelta = currentMonthFact - monthlyPlan;
  const remainingThisMonth =
    currentMonthDelta >= 0
      ? currentMonthDelta
      : Math.max(0, monthlyPlan - currentMonthFact);

  const monthStatusText =
    currentMonthDelta >= 0
      ? "Ты идёшь по плану в этом месяце"
      : "Ты пока отстаёшь от плана в этом месяце";

  const plannedNow = useMemo(() => {
    if (!plan) return 0;

    const monthly = Number(plan.monthlyContribution || 0);
    const startDate = new Date(plan.planStartDate);
    const now = new Date();

    const months =
      (now.getFullYear() - startDate.getFullYear()) * 12 +
      (now.getMonth() - startDate.getMonth());

    const safeMonths = Math.max(0, months);

    return safeMonths * monthly;
  }, [plan]);

  const deviation = totalCapital - plannedNow;

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
        <h1 className="app-page-title">Обзор</h1>
        <p className="app-page-subtitle">
          Короткий срез всей системы: где ты сейчас, как идёшь по плану и что
          происходит в этом месяце
        </p>
      </div>

      <OverviewCards
        totalCapital={totalCapital}
        plannedNow={plannedNow}
        deviation={deviation}
        formatNumber={formatNumber}
      />

      <OverviewMonthBlock
        monthlyPlan={monthlyPlan}
        currentMonthFact={currentMonthFact}
        remainingThisMonth={remainingThisMonth}
        monthStatusText={monthStatusText}
        formatNumber={formatNumber}
      />

      <OverviewRecentActions
        operations={recentOperations}
        formatNumber={formatNumber}
      />

      <OverviewAuthorNote />
    </div>
  );
}