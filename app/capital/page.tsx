// 👇 ВАЖНО: тут просто убрано условие !hasAnyOperations

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ASSET_CATEGORIES } from "@/lib/constants";
import {
  createOperation,
  fetchOperations,
  type Operation,
} from "@/lib/operations";
import {
  fetchPlanSettings,
  type PlanSettings,
} from "@/lib/plan";
import { formatNumber, formatPercent } from "@/lib/calculations";
import { showToast } from "@/lib/toast";
import OperationsList from "@/components/OperationsList";
import FactDistribution from "@/components/FactDistribution";
import MonthControlCard from "@/components/capital/MonthControlCard";
import CurrentCapitalCard from "@/components/capital/CurrentCapitalCard";
import OverallProgressCard from "@/components/capital/OverallProgressCard";
import OperationComposer from "@/components/capital/OperationComposer";
import { useCapitalData } from "@/lib/hooks/useCapitalData";

export default function CapitalPage() {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [plan, setPlan] = useState<PlanSettings | null>(null);

  const [actualContribution, setActualContribution] = useState("");
  const [contributionComment, setContributionComment] = useState("");
  const [contributionDate, setContributionDate] = useState(todayString());
  const [contributionCategory, setContributionCategory] = useState<string>(
    ASSET_CATEGORIES[0]
  );
  const [operationType, setOperationType] = useState<"income" | "expense">(
    "income"
  );

  const [adjustmentAmount, setAdjustmentAmount] = useState("");
  const [adjustmentCategory, setAdjustmentCategory] = useState<string>(
    ASSET_CATEGORIES[0]
  );
  const [adjustmentComment, setAdjustmentComment] = useState("");
  const [adjustmentDate, setAdjustmentDate] = useState(todayString());

  useEffect(() => {
    void loadOperations();
    void loadPlan();
  }, []);

  async function loadPlan() {
    const data = await fetchPlanSettings();
    setPlan(data);
  }

  async function loadOperations() {
    const data = await fetchOperations();
    setOperations(data);
  }

  async function saveContribution() {
    const amount = Number(actualContribution);

    await createOperation({
      amount,
      comment: contributionComment,
      operation_date: contributionDate,
      asset_category: contributionCategory,
      type: operationType,
    });

    setActualContribution("");
    await loadOperations();
  }

  function fillInitialCapital() {
    if (!plan) return;

    setActualContribution(plan.initialCapital || "");
    setContributionCategory(ASSET_CATEGORIES[0]);
    setContributionDate(todayString());
    setContributionComment("Старт капитала");
    setOperationType("income");
  }

  const {
    groupedFact,
    totalFactAmount,
    monthlyPlan,
    currentMonthFact,
    currentMonthDelta,
    currentMonthRemaining,
    currentMonthOver,
    currentMonthStatusText,
    plannedNow,
    deviation,
    recentMoneyOperations,
    recentAdjustments,
  } = useCapitalData({
    operations,
    plan,
  });

  return (
    <div className="space-y-4">
      <h1 className="app-page-title">Капитал</h1>

      {/* ВСЕГДА ПОКАЗЫВАЕМ */}
      <section className="app-card border border-[#2563eb]">
        <div className="space-y-3">
          <div className="app-card-title">
            Начни с фиксации текущего капитала
          </div>

          <button onClick={fillInitialCapital} className="app-button">
            Добавить стартовый капитал
          </button>
        </div>
      </section>

      <MonthControlCard
        monthlyPlan={monthlyPlan}
        currentMonthFact={currentMonthFact}
        currentMonthDelta={currentMonthDelta}
        currentMonthRemaining={currentMonthRemaining}
        currentMonthOver={currentMonthOver}
        currentMonthStatusText={currentMonthStatusText}
        formatNumber={formatNumber}
      />

      <CurrentCapitalCard
        totalFactAmount={totalFactAmount}
        formatNumber={formatNumber}
      />

      <OverallProgressCard
        plannedNow={plannedNow}
        totalFactAmount={totalFactAmount}
        deviation={deviation}
        formatNumber={formatNumber}
      />
    </div>
  );
}

function todayString() {
  return new Date().toISOString().slice(0, 10);
}