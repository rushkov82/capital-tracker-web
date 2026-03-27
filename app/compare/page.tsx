"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchOperations, type Operation } from "@/lib/operations";
import { buildFactDistribution, getTotalFactAmount } from "@/lib/portfolio";
import {
  DEFAULT_PLAN_SETTINGS,
  getPlanAllocation,
  loadPlanSettings,
  PLAN_STORAGE_KEY,
  PLAN_UPDATED_EVENT,
  type PlanSettings,
} from "@/lib/plan";
import { formatPercent } from "@/lib/calculations";

type CompareRow = {
  category: string;
  planPercent: number;
  factPercent: number;
  deltaPercent: number;
};

export default function ComparePage() {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [planSettings, setPlanSettings] = useState<PlanSettings>(
    DEFAULT_PLAN_SETTINGS
  );
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    setPlanSettings(loadPlanSettings());
    void loadOperations();

    function syncPlanSettings() {
      setPlanSettings(loadPlanSettings());
    }

    function handleStorage(event: StorageEvent) {
      if (event.key === PLAN_STORAGE_KEY) {
        syncPlanSettings();
      }
    }

    function handlePlanUpdated() {
      syncPlanSettings();
    }

    window.addEventListener("storage", handleStorage);
    window.addEventListener(PLAN_UPDATED_EVENT, handlePlanUpdated);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(PLAN_UPDATED_EVENT, handlePlanUpdated);
    };
  }, []);

  async function loadOperations() {
    try {
      const data = await fetchOperations();
      setOperations(data);
    } catch (error) {
      setErrorText(
        error instanceof Error ? error.message : "Ошибка загрузки операций"
      );
    }
  }

  const factItems = useMemo(() => buildFactDistribution(operations), [operations]);

  const totalFactAmount = useMemo(
    () => getTotalFactAmount(factItems),
    [factItems]
  );

  const planItems = useMemo(
    () => getPlanAllocation(planSettings),
    [planSettings]
  );

  const compareRows = useMemo<CompareRow[]>(() => {
    return planItems.map((planItem) => {
      const factItem = factItems.find(
        (item) => item.category === planItem.category
      );

      const factPercent =
        totalFactAmount > 0 && factItem
          ? (factItem.amount / totalFactAmount) * 100
          : 0;

      return {
        category: planItem.category,
        planPercent: planItem.planPercent,
        factPercent,
        deltaPercent: factPercent - planItem.planPercent,
      };
    });
  }, [planItems, factItems, totalFactAmount]);

  const underweightRows = useMemo(() => {
    return [...compareRows]
      .filter((row) => row.deltaPercent < 0)
      .sort((a, b) => a.deltaPercent - b.deltaPercent)
      .slice(0, 2);
  }, [compareRows]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="app-page-title">Сравнение</h1>
        <p className="app-page-subtitle">
          Сопоставление целевой структуры портфеля с фактическим распределением
        </p>
      </div>

      {errorText && <div className="app-error-box">{errorText}</div>}

      <section className="app-card">
        <h2 className="app-card-title mb-5">План vs Факт</h2>

        <div className="space-y-3">
          <div className="hidden grid-cols-[1.6fr_0.7fr_0.7fr_0.8fr] gap-4 px-4 md:grid">
            <div className="app-text-small">Категория</div>
            <div className="app-text-small">План %</div>
            <div className="app-text-small">Факт %</div>
            <div className="app-text-small">Отклонение</div>
          </div>

          {compareRows.map((row) => {
            const isOver = row.deltaPercent > 0.01;
            const isUnder = row.deltaPercent < -0.01;

            const deltaClass = isOver
              ? "text-amber-500"
              : isUnder
                ? "text-sky-500"
                : "";

            const deltaPrefix = row.deltaPercent > 0 ? "+" : "";

            return (
              <div key={row.category}>
                <div className="hidden rounded-[14px] border border-[var(--border)] bg-[var(--card)] px-4 py-3 md:grid md:grid-cols-[1.6fr_0.7fr_0.7fr_0.8fr] md:gap-4">
                  <div className="app-text">{row.category}</div>
                  <div className="app-label">
                    {formatPercent(row.planPercent)} %
                  </div>
                  <div className="app-label">
                    {formatPercent(row.factPercent)} %
                  </div>
                  <div className={`app-text ${deltaClass}`}>
                    {deltaPrefix}
                    {formatPercent(row.deltaPercent)} %
                  </div>
                </div>

                <div className="rounded-[14px] border border-[var(--border)] bg-[var(--card)] p-4 md:hidden">
                  <div className="app-text mb-3">{row.category}</div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <div className="app-text-small mb-1">План</div>
                      <div className="app-label">
                        {formatPercent(row.planPercent)} %
                      </div>
                    </div>

                    <div>
                      <div className="app-text-small mb-1">Факт</div>
                      <div className="app-label">
                        {formatPercent(row.factPercent)} %
                      </div>
                    </div>

                    <div>
                      <div className="app-text-small mb-1">Отклонение</div>
                      <div className={`app-text ${deltaClass}`}>
                        {deltaPrefix}
                        {formatPercent(row.deltaPercent)} %
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="app-card">
        <h2 className="app-card-title mb-5">Куда направить следующий взнос</h2>

        {underweightRows.length === 0 ? (
          <div className="rounded-[14px] border border-[var(--border)] bg-[var(--card)] p-4">
            <div className="app-text">Сильных недоборов не найдено</div>
            <div className="app-text-small">
              Фактическая структура сейчас близка к целевой.
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {underweightRows.map((row, index) => (
              <div
                key={row.category}
                className="rounded-[14px] border border-[var(--border)] bg-[var(--card)] p-4"
              >
                <div className="app-text">
                  {index === 0 ? "Приоритет" : "Второй приоритет"}:{" "}
                  {row.category}
                </div>
                <div className="app-text-small">
                  Недобор: {formatPercent(Math.abs(row.deltaPercent))} %
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}