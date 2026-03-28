"use client";

import { useEffect, useState } from "react";
import { fetchOperations, type Operation } from "@/lib/operations";
import { formatNumber } from "@/lib/calculations";
import { showToast } from "@/lib/toast";
import { ASSET_CATEGORIES } from "@/lib/constants";
import OperationsList from "@/components/OperationsList";

export default function HistoryPage() {
  const [operations, setOperations] = useState<Operation[]>([]);

  useEffect(() => {
    void loadOperations();
  }, []);

  async function loadOperations() {
    try {
      const data = await fetchOperations();
      setOperations(data);
    } catch (error) {
      showToast({
        type: "error",
        title: "Не удалось загрузить операции",
        description:
          error instanceof Error ? error.message : "Ошибка загрузки",
      });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="app-page-title">Все операции</h1>
        <p className="app-page-subtitle">Полная история действий по капиталу</p>
      </div>

      <section className="app-card">
        <OperationsList
          cardClass=""
          operations={operations}
          categories={[...ASSET_CATEGORIES]}
          formatNumber={formatNumber}
          onReload={loadOperations}
        />
      </section>
    </div>
  );
}