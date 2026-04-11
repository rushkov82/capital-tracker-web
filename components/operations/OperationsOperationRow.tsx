"use client";

import { ArrowUpRight, Plus, RefreshCw } from "lucide-react";
import type { Operation } from "@/lib/operations";
import { formatNumber } from "@/lib/calculations";
import { getSignedAmount } from "@/components/operations/operations-utils";

type OperationsOperationRowProps = {
  operation: Operation;
  onOpen: (operation: Operation) => void;
};

export default function OperationsOperationRow({
  operation,
  onOpen,
}: OperationsOperationRowProps) {
  const signedAmount = getSignedAmount(operation);

  const amountColor =
    signedAmount < 0
      ? "var(--danger)"
      : operation.type === "adjustment"
      ? "var(--info)"
      : "var(--accent)";

  return (
    <button
      type="button"
      onClick={() => onOpen(operation)}
      className="w-full border-b border-[var(--border)] py-3 text-left transition last:border-0 last:pb-0"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex items-center gap-2">
          <OperationTypeIcon type={operation.type} />

          <div className="min-w-0 truncate app-text-small">
            {new Date(operation.operation_date).toLocaleDateString("ru-RU")}
            {operation.asset_category ? ` · ${operation.asset_category}` : ""}
            {operation.comment ? (
              <span className="hidden md:inline">
                {` · ${operation.comment}`}
              </span>
            ) : null}
          </div>
        </div>

        <div
          className="shrink-0 whitespace-nowrap text-[15px] font-semibold"
          style={{ color: amountColor }}
        >
          {signedAmount > 0 ? "+" : ""}
          {formatNumber(signedAmount)} ₽
        </div>
      </div>
    </button>
  );
}

function OperationTypeIcon({
  type,
}: {
  type: Operation["type"];
}) {
  if (type === "expense") {
    return (
      <span
        className="inline-flex h-5 w-5 items-center justify-center rounded-full"
        style={{ color: "var(--danger)" }}
      >
        <ArrowUpRight size={14} strokeWidth={2} />
      </span>
    );
  }

  if (type === "adjustment") {
    return (
      <span
        className="inline-flex h-5 w-5 items-center justify-center rounded-full"
        style={{ color: "var(--info)" }}
      >
        <RefreshCw size={14} strokeWidth={2} />
      </span>
    );
  }

  return (
    <span
      className="inline-flex h-5 w-5 items-center justify-center rounded-full"
      style={{ color: "var(--accent)" }}
    >
      <Plus size={14} strokeWidth={2} />
    </span>
  );
}