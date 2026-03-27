"use client";

import { useEffect, useState } from "react";
import { fetchOperations, type Operation } from "@/lib/operations";
import { formatNumber } from "@/lib/calculations";
import OperationsList from "@/components/OperationsList";

export default function HistoryPage() {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    void loadOperations();
  }, []);

  async function loadOperations() {
    try {
      const data = await fetchOperations();
      const sorted = [...data].sort((a, b) => {
        const dateCompare = b.operation_date.localeCompare(a.operation_date);
        if (dateCompare !== 0) return dateCompare;
        return b.created_at.localeCompare(a.created_at);
      });

      setOperations(sorted);
    } catch (error) {
      setErrorText(
        error instanceof Error ? error.message : "Ошибка загрузки операций"
      );
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="app-page-title">Все операции</h1>
        <p className="app-page-subtitle">Полная история взносов</p>
      </div>

      {errorText && <div className="app-error-box">{errorText}</div>}

      <section className="app-card">
        <OperationsList
          cardClass=""
          operations={operations}
          formatNumber={formatNumber}
        />
      </section>
    </div>
  );
}