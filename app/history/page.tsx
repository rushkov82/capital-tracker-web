"use client";

import { useEffect, useState } from "react";
import {
  fetchOperations,
  removeOperation,
  updateOperation,
  type Operation,
} from "@/lib/operations";
import { ASSET_CATEGORIES } from "@/lib/constants";
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
      setOperations(data);
    } catch (error) {
      setErrorText(
        error instanceof Error ? error.message : "Ошибка загрузки"
      );
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="app-page-title">История операций</h1>
        <p className="app-page-subtitle">
          Все записи по капиталу
        </p>
      </div>

      {errorText && <div className="app-error-box">{errorText}</div>}

      <OperationsList
        cardClass="app-card"
        operations={operations}
        editingId={null}
        editingAmount=""
        setEditingAmount={() => {}}
        editingComment=""
        setEditingComment={() => {}}
        editingDate=""
        setEditingDate={() => {}}
        editingCategory={ASSET_CATEGORIES[0]}
        setEditingCategory={() => {}}
        categories={[...ASSET_CATEGORIES]}
        commonInputClass="app-input"
        selectClass="app-select"
        formatNumber={formatNumber}
        startEditing={() => {}}
        cancelEditing={() => {}}
        saveEditedOperation={() => {}}
        deleteOperation={() => {}}
      />
    </div>
  );
}