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
    try {
      const data = await fetchPlanSettings();
      setPlan(data);
    } catch (error) {
      console.log("plan load error", error);
    }
  }

  async function loadOperations() {
    try {
      const data = await fetchOperations();
      setOperations(data);
    } catch (error) {
      showToast({
        type: "error",
        title: "Не удалось загрузить данные",
        description:
          error instanceof Error ? error.message : "Ошибка загрузки операций",
      });
    }
  }

  async function saveContribution() {
    const amount = Number(actualContribution);

    if (!amount || Number.isNaN(amount) || amount <= 0) {
      showToast({
        type: "error",
        title: "Не удалось сохранить",
        description: "Введите корректную сумму",
      });
      return;
    }

    try {
      await createOperation({
        amount,
        comment: contributionComment,
        operation_date: contributionDate,
        asset_category: contributionCategory,
        type: operationType,
      });

      setActualContribution("");
      setContributionComment("");
      setContributionDate(todayString());
      setContributionCategory(ASSET_CATEGORIES[0]);
      setOperationType("income");

      await loadOperations();
    } catch (error) {
      showToast({
        type: "error",
        title: "Не удалось сохранить",
        description:
          error instanceof Error ? error.message : "Ошибка сохранения операции",
      });
    }
  }

  async function saveAdjustment() {
    const amount = Number(adjustmentAmount);

    if (!amount || Number.isNaN(amount)) {
      showToast({
        type: "error",
        title: "Не удалось сохранить переоценку",
        description: "Введите корректную сумму",
      });
      return;
    }

    try {
      await createOperation({
        amount,
        comment: adjustmentComment,
        operation_date: adjustmentDate,
        asset_category: adjustmentCategory,
        type: "adjustment",
      });

      setAdjustmentAmount("");
      setAdjustmentComment("");
      setAdjustmentDate(todayString());
      setAdjustmentCategory(ASSET_CATEGORIES[0]);

      await loadOperations();
    } catch (error) {
      showToast({
        type: "error",
        title: "Не удалось сохранить переоценку",
        description:
          error instanceof Error ? error.message : "Ошибка сохранения",
      });
    }
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
      <div>
        <h1 className="app-page-title">Капитал</h1>
        <p className="app-page-subtitle">
          Реальные деньги, история операций и текущее состояние капитала
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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

      <OperationComposer
        categories={[...ASSET_CATEGORIES]}
        actualContribution={actualContribution}
        setActualContribution={setActualContribution}
        contributionCategory={contributionCategory}
        setContributionCategory={setContributionCategory}
        contributionDate={contributionDate}
        setContributionDate={setContributionDate}
        contributionComment={contributionComment}
        setContributionComment={setContributionComment}
        operationType={operationType}
        setOperationType={setOperationType}
        onSaveContribution={saveContribution}
        adjustmentAmount={adjustmentAmount}
        setAdjustmentAmount={setAdjustmentAmount}
        adjustmentCategory={adjustmentCategory}
        setAdjustmentCategory={setAdjustmentCategory}
        adjustmentDate={adjustmentDate}
        setAdjustmentDate={setAdjustmentDate}
        adjustmentComment={adjustmentComment}
        setAdjustmentComment={setAdjustmentComment}
        onSaveAdjustment={saveAdjustment}
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.8fr)]">
        <section className="app-card">
          <h2 className="app-card-title mb-4">Последние операции</h2>

          <OperationsList
            cardClass=""
            operations={recentMoneyOperations}
            categories={[...ASSET_CATEGORIES]}
            formatNumber={formatNumber}
            onReload={loadOperations}
          />

          <div className="border-t border-[var(--border)] mt-4 pt-3">
            <div className="flex justify-end">
              <Link href="/history" className="app-button">
                Все операции →
              </Link>
            </div>
          </div>
        </section>

        <div className="grid gap-4">
          <section className="app-card">
            <h2 className="app-card-title mb-2">Переоценка активов</h2>
            <div className="app-text-small mb-4">
              История изменений стоимости
            </div>

            <OperationsList
              cardClass=""
              operations={recentAdjustments}
              categories={[...ASSET_CATEGORIES]}
              formatNumber={formatNumber}
              onReload={loadOperations}
            />
          </section>

          <FactDistribution
            cardClass="app-card"
            title="Баланс операций"
            subtitle="Пополнения, выводы и переоценки в текущем капитале"
            items={groupedFact}
            totalAmount={totalFactAmount}
            formatNumber={formatNumber}
            formatPercent={formatPercent}
          />
        </div>
      </div>
    </div>
  );
}

function todayString() {
  return new Date().toISOString().slice(0, 10);
}