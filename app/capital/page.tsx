"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createOperation,
  fetchOperations,
  type Operation,
} from "@/lib/operations";
import { showToast } from "@/lib/toast";
import CapitalHeaderCard from "@/components/capital/CapitalHeaderCard";
import CapitalStructureCard from "@/components/capital/CapitalStructureCard";
import CapitalActionsCard from "@/components/capital/CapitalActionsCard";
import CapitalRecentOperationsCard from "@/components/capital/CapitalRecentOperationsCard";
import CapitalHistoryCard from "@/components/capital/CapitalHistoryCard";

type ActionType = "income" | "expense" | "adjustment";

type StructureItem = {
  category: string;
  amount: number;
};

export default function CapitalPage() {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [amount, setAmount] = useState("");
  const [actionType, setActionType] = useState<ActionType>("income");

  useEffect(() => {
    void loadOperations();
  }, []);

  async function loadOperations() {
    try {
      const data = await fetchOperations();
      setOperations(data);
    } catch {
      showToast({
        type: "error",
        title: "Ошибка",
        description: "Не удалось загрузить операции",
      });
    }
  }

  async function handleSubmit() {
    const value = Number(amount);

    if (!value || Number.isNaN(value)) {
      showToast({
        type: "error",
        title: "Ошибка",
        description: "Введите корректную сумму",
      });
      return;
    }

    try {
      await createOperation({
        amount: Math.abs(value),
        type: actionType,
      });

      setAmount("");
      await loadOperations();
    } catch {
      showToast({
        type: "error",
        title: "Ошибка",
        description: "Не удалось сохранить операцию",
      });
    }
  }

  const totalCapital = useMemo(() => {
    return operations.reduce((sum, operation) => {
      if (operation.type === "expense") return sum - operation.amount;
      return sum + operation.amount;
    }, 0);
  }, [operations]);

  const structureItems = useMemo<StructureItem[]>(() => {
    const grouped = new Map<string, number>();

    for (const operation of operations) {
      const category = operation.asset_category || "Без категории";

      const signedAmount =
        operation.type === "expense"
          ? -operation.amount
          : operation.amount;

      grouped.set(category, (grouped.get(category) || 0) + signedAmount);
    }

    return Array.from(grouped.entries())
      .map(([category, amount]) => ({
        category,
        amount,
      }))
      .filter((item) => item.amount !== 0)
      .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
  }, [operations]);

  const recentOperations = useMemo(() => {
    return [...operations]
      .sort((a, b) => {
        const dateCompare = b.operation_date.localeCompare(a.operation_date);
        if (dateCompare !== 0) return dateCompare;
        return b.created_at.localeCompare(a.created_at);
      })
      .slice(0, 5);
  }, [operations]);

  const sortedOperations = useMemo(() => {
    return [...operations].sort((a, b) => {
      const dateCompare = b.operation_date.localeCompare(a.operation_date);
      if (dateCompare !== 0) return dateCompare;
      return b.created_at.localeCompare(a.created_at);
    });
  }, [operations]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="app-page-title">Капитал</h1>
        <p className="app-page-subtitle">
          Что у тебя есть сейчас и что ты реально делаешь с деньгами
        </p>
      </div>

      <CapitalHeaderCard totalCapital={totalCapital} />

      <CapitalStructureCard
        items={structureItems}
        totalCapital={totalCapital}
      />

      <CapitalActionsCard
        amount={amount}
        setAmount={setAmount}
        actionType={actionType}
        setActionType={setActionType}
        onSubmit={handleSubmit}
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <CapitalRecentOperationsCard operations={recentOperations} />
        <CapitalHistoryCard operations={sortedOperations} />
      </div>
    </div>
  );
}