"use client";

import Link from "next/link";
import { ArrowUpRight, Plus, RefreshCw } from "lucide-react";
import type { Operation } from "@/lib/operations";
import { formatNumber } from "@/lib/calculations";
import { getSignedAmount } from "@/components/operations/operations-utils";

type OverviewDynamicsCardProps = {
  operations: Operation[];
  formatNumber: (value: number) => string;
};

export default function OverviewDynamicsCard({
  operations,
}: OverviewDynamicsCardProps) {
  const previewOperations = operations.slice(0, 3);

  return (
    <section className="app-card">
      <div className="flex items-center justify-between gap-3">
        <div className="app-card-title">Последние операции</div>

        <Link
          href="/app/operations"
          className="text-[12px] font-medium leading-none"
          style={{ color: "var(--accent)" }}
        >
          Все операции
        </Link>
      </div>

      {previewOperations.length === 0 ? (
        <div className="mt-3 app-text-small">Пока операций нет</div>
      ) : (
        <div className="mt-3">
          {previewOperations.map((operation) => {
            const signedAmount = getSignedAmount(operation);

            const amountColor =
              signedAmount < 0
                ? "var(--danger)"
                : operation.type === "adjustment"
                  ? "var(--info)"
                  : "var(--accent)";

            return (
              <div
                key={operation.id}
                className="border-b border-[var(--border)] py-2.5 last:border-0 last:pb-0"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex items-center gap-2">
                    <OperationTypeIcon type={operation.type} />

                    <div className="min-w-0 truncate text-[12px] leading-[1.2] text-[var(--muted-foreground)]">
                      {new Date(operation.operation_date).toLocaleDateString("ru-RU")}
                      {operation.asset_category ? ` · ${operation.asset_category}` : ""}
                      {operation.comment ? ` · ${operation.comment}` : ""}
                    </div>
                  </div>

                  <div
                    className="shrink-0 whitespace-nowrap text-[13px] font-semibold"
                    style={{ color: amountColor }}
                  >
                    {signedAmount > 0 ? "+" : ""}
                    {formatNumber(signedAmount)} ₽
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
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
        className="inline-flex h-4 w-4 items-center justify-center shrink-0"
        style={{ color: "var(--danger)" }}
      >
        <ArrowUpRight size={12} strokeWidth={2} />
      </span>
    );
  }

  if (type === "adjustment") {
    return (
      <span
        className="inline-flex h-4 w-4 items-center justify-center shrink-0"
        style={{ color: "var(--info)" }}
      >
        <RefreshCw size={12} strokeWidth={2} />
      </span>
    );
  }

  return (
    <span
      className="inline-flex h-4 w-4 items-center justify-center shrink-0"
      style={{ color: "var(--accent)" }}
    >
      <Plus size={12} strokeWidth={2} />
    </span>
  );
}