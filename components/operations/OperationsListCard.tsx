"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, Funnel } from "lucide-react";
import type { Operation } from "@/lib/operations";
import { groupOperationsByMonth } from "@/components/operations/operations-utils";
import OperationsOperationRow from "@/components/operations/OperationsOperationRow";

type OperationsListCardProps = {
  operations: Operation[];
  onOpen: (operation: Operation) => void;
  type: string;
  setType: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  period: string;
  setPeriod: (value: string) => void;
  sort: string;
  setSort: (value: string) => void;
};

const PAGE_SIZE = 20;

export default function OperationsListCard({
  operations,
  onOpen,
  type,
  setType,
  category,
  setCategory,
  period,
  setPeriod,
  sort,
  setSort,
}: OperationsListCardProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [operations]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!popoverRef.current) return;
      if (!popoverRef.current.contains(event.target as Node)) {
        setIsFiltersOpen(false);
      }
    }

    if (isFiltersOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFiltersOpen]);

  const visibleOperations = useMemo(() => {
    return operations.slice(0, visibleCount);
  }, [operations, visibleCount]);

  const groups = useMemo(() => {
    return groupOperationsByMonth(visibleOperations);
  }, [visibleOperations]);

  const hasMore = operations.length > visibleCount;
  const firstGroupLabel = groups[0]?.label || "История";

  return (
    <section className="app-card h-full">
      <div className="flex h-full min-h-0 flex-col">
        {groups.length === 0 ? (
          <div className="app-text-small">
            По текущим фильтрам операций не найдено
          </div>
        ) : (
          <>
            <div className="relative flex items-center justify-between gap-3 pb-3">
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex h-6 w-6 items-center justify-center rounded-full"
                  style={{
                    background: "rgba(148, 163, 184, 0.12)",
                    color: "var(--text-secondary)",
                  }}
                >
                  <CalendarDays size={14} strokeWidth={2} />
                </span>

                <div className="app-card-title">{firstGroupLabel}</div>
              </div>

              <div ref={popoverRef} className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setIsFiltersOpen((value) => !value)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-[var(--border)] transition"
                  style={{ color: "var(--text-secondary)" }}
                  aria-label="Фильтры"
                >
                  <Funnel size={15} strokeWidth={2} />
                </button>

                {isFiltersOpen && (
                  <div className="absolute right-0 top-[44px] z-20 w-[280px] rounded-[14px] border border-[var(--border)] bg-[var(--card)] p-3 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
                    <div className="grid gap-3">
                      <select
                        className="app-input app-select pr-10"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                      >
                        <option value="all">Все типы</option>
                        <option value="income">Пополнение</option>
                        <option value="expense">Вывод</option>
                        <option value="adjustment">Переоценка</option>
                      </select>

                      <select
                        className="app-input app-select pr-10"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="all">Все категории</option>
                        <option value="Cash">Cash</option>
                        <option value="Акции">Акции</option>
                        <option value="Облигации">Облигации</option>
                        <option value="Валюта">Валюта</option>
                        <option value="Металлы">Металлы</option>
                        <option value="Недвижимость">Недвижимость</option>
                        <option value="Депозиты">Депозиты</option>
                        <option value="Крипта">Крипта</option>
                        <option value="Прочее">Прочее</option>
                      </select>

                      <select
                        className="app-input app-select pr-10"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                      >
                        <option value="all">Всё время</option>
                        <option value="month">Этот месяц</option>
                        <option value="year">Этот год</option>
                      </select>

                      <select
                        className="app-input app-select pr-10"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                      >
                        <option value="new">Сначала новые</option>
                        <option value="old">Сначала старые</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="app-divider" />

            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
              <div className="space-y-5 pt-2">
                {groups.map((group, index) => (
                  <div key={group.key} className="space-y-2">
                    {index > 0 ? (
                      <>
                        <div className="flex items-center gap-2">
                          <span
                            className="inline-flex h-6 w-6 items-center justify-center rounded-full"
                            style={{
                              background: "rgba(148, 163, 184, 0.12)",
                              color: "var(--text-secondary)",
                            }}
                          >
                            <CalendarDays size={14} strokeWidth={2} />
                          </span>

                          <div className="app-card-title">{group.label}</div>
                        </div>

                        <div className="app-divider" />
                      </>
                    ) : null}

                    <div className="space-y-0">
                      {group.operations.map((operation) => (
                        <OperationsOperationRow
                          key={operation.id}
                          operation={operation}
                          onOpen={onOpen}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {hasMore && (
          <div className="pt-3">
            <button
              type="button"
              className="app-button-secondary w-full"
              onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
            >
              Показать ещё
            </button>
          </div>
        )}
      </div>
    </section>
  );
}