"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ASSET_CATEGORIES } from "@/lib/constants";
import { buildFactDistribution, getTotalFactAmount } from "@/lib/portfolio";
import {
  createOperation,
  fetchOperations,
  type Operation,
} from "@/lib/operations";
import { showToast } from "@/lib/toast";
import ContributionForm from "@/components/ContributionForm";
import AdjustmentForm from "@/components/AdjustmentForm";
import FactDistribution from "@/components/FactDistribution";
import OperationsList from "@/components/OperationsList";
import { formatNumber, formatPercent } from "@/lib/calculations";
import { fetchPlanSettings } from "@/lib/plan";

export default function CapitalPage() {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [plan, setPlan] = useState<any>(null);

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
    } catch (e) {
      console.log("plan load error", e);
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
        title: "Не удалось сохранить корректировку",
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
        title: "Не удалось сохранить корректировку",
        description:
          error instanceof Error ? error.message : "Ошибка сохранения",
      });
    }
  }

  const groupedFact = useMemo(() => {
    return buildFactDistribution(operations);
  }, [operations]);

  const totalFactAmount = useMemo(() => {
    return getTotalFactAmount(groupedFact);
  }, [groupedFact]);

  // ===== 🔥 ТЕКУЩИЙ МЕСЯЦ =====

  const currentMonthOperations = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();

    return operations.filter((op) => {
      if (op.type === "adjustment") return false;

      const d = new Date(op.operation_date);
      return d.getFullYear() === y && d.getMonth() === m;
    });
  }, [operations]);

  const currentMonthFact = useMemo(() => {
    return currentMonthOperations.reduce((sum, op) => {
      if (op.type === "expense") return sum - op.amount;
      return sum + op.amount;
    }, 0);
  }, [currentMonthOperations]);

  const monthlyPlan = Number(plan?.monthlyContribution || 0);
  const currentMonthDeviation = currentMonthFact - monthlyPlan;

  const statusText =
    currentMonthDeviation >= 0
      ? "Ты идёшь по плану"
      : "Ты отстаёшь от плана";

  // ===== СТАРЫЙ БЛОК =====

  const plannedNow = useMemo(() => {
    if (!plan) return 0;

    const start = Number(plan.initialCapital || 0);
    const monthly = Number(plan.monthlyContribution || 0);

    const startDate = new Date(plan.planStartDate);
    const now = new Date();

    const months =
      (now.getFullYear() - startDate.getFullYear()) * 12 +
      (now.getMonth() - startDate.getMonth());

    const safeMonths = Math.max(0, months);

    return start + safeMonths * monthly;
  }, [plan]);

  const deviation = totalFactAmount - plannedNow;

  const moneyOperations = useMemo(() => {
    return operations.filter(
      (operation) => operation.type === "income" || operation.type === "expense"
    );
  }, [operations]);

  const adjustmentOperations = useMemo(() => {
    return operations.filter((operation) => operation.type === "adjustment");
  }, [operations]);

  const recentMoneyOperations = useMemo(() => {
    return [...moneyOperations]
      .sort((a, b) => {
        const dateCompare = b.operation_date.localeCompare(a.operation_date);
        if (dateCompare !== 0) return dateCompare;
        return b.created_at.localeCompare(a.created_at);
      })
      .slice(0, 3);
  }, [moneyOperations]);

  const recentAdjustments = useMemo(() => {
    return [...adjustmentOperations]
      .sort((a, b) => {
        const dateCompare = b.operation_date.localeCompare(a.operation_date);
        if (dateCompare !== 0) return dateCompare;
        return b.created_at.localeCompare(a.created_at);
      })
      .slice(0, 3);
  }, [adjustmentOperations]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="app-page-title">Капитал</h1>
        <p className="app-page-subtitle">
          Реальные деньги, история взносов и текущая структура
        </p>
      </div>

      {/* 🔥 НОВЫЙ БЛОК */}
      <section className="app-card">
        <div className="app-text-small mb-2">Текущий месяц</div>

        <div className="space-y-2 text-[14px]">
          <div className="flex justify-between">
            <span>План</span>
            <b>{formatNumber(monthlyPlan)} ₽</b>
          </div>

          <div className="flex justify-between">
            <span>Факт</span>
            <b>{formatNumber(currentMonthFact)} ₽</b>
          </div>

          <div className="flex justify-between">
            <span>Отклонение</span>
            <b style={{ color: currentMonthDeviation < 0 ? "#dc2626" : "#16a34a" }}>
              {formatNumber(currentMonthDeviation)} ₽
            </b>
          </div>

          <div
            className="pt-2 text-[13px]"
            style={{
              color: currentMonthDeviation < 0 ? "#dc2626" : "#16a34a",
            }}
          >
            {statusText}
          </div>
        </div>
      </section>

      {/* остальной код ниже не меняем */}