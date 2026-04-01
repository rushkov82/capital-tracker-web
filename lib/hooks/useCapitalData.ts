import { useMemo } from "react";
import type { Operation } from "@/lib/operations";
import type { PlanSettings } from "@/lib/plan";
import { buildFactDistribution, getTotalFactAmount } from "@/lib/portfolio";

type UseCapitalDataInput = {
  operations: Operation[];
  plan: PlanSettings | null;
};

export function useCapitalData({ operations, plan }: UseCapitalDataInput) {
  const groupedFact = useMemo(() => {
    return buildFactDistribution(operations);
  }, [operations]);

  const totalFactAmount = useMemo(() => {
    return getTotalFactAmount(groupedFact);
  }, [groupedFact]);

  const currentMonthOperations = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    return operations.filter((operation) => {
      if (operation.type === "adjustment") {
        return false;
      }

      const operationDate = new Date(operation.operation_date);

      return (
        operationDate.getFullYear() === year &&
        operationDate.getMonth() === month
      );
    });
  }, [operations]);

  const currentMonthFact = useMemo(() => {
    return currentMonthOperations.reduce((sum, operation) => {
      if (operation.type === "expense") {
        return sum - operation.amount;
      }

      return sum + operation.amount;
    }, 0);
  }, [currentMonthOperations]);

  const monthlyPlan = Number(plan?.monthlyContribution || 0);
  const currentMonthDelta = currentMonthFact - monthlyPlan;
  const currentMonthRemaining = Math.max(0, monthlyPlan - currentMonthFact);
  const currentMonthOver = Math.max(0, currentMonthFact - monthlyPlan);

  const currentMonthStatusText =
    currentMonthDelta >= 0 ? "Ты идёшь по плану" : "Ты отстаёшь от плана";

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
      .slice(0, 5);
  }, [moneyOperations]);

  const recentAdjustments = useMemo(() => {
    return [...adjustmentOperations]
      .sort((a, b) => {
        const dateCompare = b.operation_date.localeCompare(a.operation_date);
        if (dateCompare !== 0) return dateCompare;
        return b.created_at.localeCompare(a.created_at);
      })
      .slice(0, 5);
  }, [adjustmentOperations]);

  return {
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
  };
}