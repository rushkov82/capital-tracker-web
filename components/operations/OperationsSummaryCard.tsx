"use client";

import { useEffect, useState } from "react";
import type { Operation } from "@/lib/operations";
import { formatNumber } from "@/lib/calculations";
import type { OperationFormActionType } from "@/components/operations/OperationForm";

type OperationsSummaryCardProps = {
  operations: Operation[];
};

export default function OperationsSummaryCard({
  operations,
}: OperationsSummaryCardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const currentMonthTotal = operations
    .filter((operation) => {
      const date = new Date(operation.operation_date);
      return date >= currentMonthStart && date < nextMonthStart;
    })
    .reduce((sum, operation) => sum + getSignedAmount(operation), 0);

  const currentMonthLabel = getMonthNamePrepositional(currentMonthStart);

  const mainColor =
    currentMonthTotal < 0 ? "var(--danger)" : "var(--accent)";

  return (
    <section className="app-card">
      <div className="space-y-2">
        <div className="app-card-title">
          Прирост капитала в {currentMonthLabel}
        </div>

        <div
          className="text-[22px] leading-[28px] font-semibold"
          style={{ color: mainColor }}
        >
          {currentMonthTotal > 0 ? "+" : ""}
          {formatNumber(currentMonthTotal)} ₽
        </div>
      </div>
    </section>
  );
}

function getSignedAmount(operation: {
  type: OperationFormActionType;
  amount: number;
}) {
  if (operation.type === "expense") {
    return -Math.abs(operation.amount);
  }

  if (operation.type === "adjustment") {
    return operation.amount;
  }

  return Math.abs(operation.amount);
}

function getMonthNamePrepositional(date: Date) {
  const names = [
    "январе",
    "феврале",
    "марте",
    "апреле",
    "мае",
    "июне",
    "июле",
    "августе",
    "сентябре",
    "октябре",
    "ноябре",
    "декабре",
  ];

  return names[date.getMonth()];
}