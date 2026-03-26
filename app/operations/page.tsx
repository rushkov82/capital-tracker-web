"use client";

import { useEffect, useState } from "react";
import { ASSET_CATEGORIES } from "@/lib/constants";
import {
  fetchOperations,
  removeOperation,
  updateOperation,
  type Operation,
} from "@/lib/operations";
import { formatNumber } from "@/lib/calculations";
import OperationsList from "@/components/OperationsList";

export default function OperationsPage() {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [errorText, setErrorText] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingAmount, setEditingAmount] = useState("");
  const [editingComment, setEditingComment] = useState("");
  const [editingDate, setEditingDate] = useState("");
  const [editingCategory, setEditingCategory] = useState<string>(
    ASSET_CATEGORIES[0]
  );

  useEffect(() => {
    void loadOperations();
  }, []);

  async function loadOperations() {
    try {
      const data = await fetchOperations();
      setOperations(data);
    } catch (error) {
      console.log("Ошибка загрузки:", error);
      setErrorText(
        error instanceof Error ? error.message : "Ошибка загрузки операций"
      );
    }
  }

  function startEditing(op: Operation) {
    setEditingId(op.id);
    setEditingAmount(String(op.amount));
    setEditingComment(op.comment ?? "");
    setEditingDate(op.operation_date);
    setEditingCategory(op.asset_category || ASSET_CATEGORIES[0]);
    setErrorText("");
  }

  function cancelEditing() {
    setEditingId(null);
    setEditingAmount("");
    setEditingComment("");
    setEditingDate("");
    setEditingCategory(ASSET_CATEGORIES[0]);
  }

  async function saveEditedOperation() {
    if (!editingId) return;

    setErrorText("");

    const amount = Number(editingAmount);

    if (!amount || Number.isNaN(amount) || amount <= 0) {
      setErrorText("Введите корректную сумму");
      return;
    }

    if (!editingDate) {
      setErrorText("Укажите дату");
      return;
    }

    if (!editingCategory) {
      setErrorText("Выберите категорию");
      return;
    }

    try {
      await updateOperation(editingId, {
        amount,
        comment: editingComment,
        operation_date: editingDate,
        asset_category: editingCategory,
      });

      cancelEditing();
      await loadOperations();
    } catch (error) {
      console.log("Ошибка обновления:", error);
      setErrorText(
        error instanceof Error ? error.message : "Ошибка обновления операции"
      );
    }
  }

  async function deleteOperation(id: string) {
    const ok = window.confirm("Удалить эту запись?");
    if (!ok) return;

    setErrorText("");

    try {
      await removeOperation(id);

      if (editingId === id) {
        cancelEditing();
      }

      await loadOperations();
    } catch (error) {
      console.log("Ошибка удаления:", error);
      setErrorText(
        error instanceof Error ? error.message : "Ошибка удаления операции"
      );
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="app-page-title">Операции</h1>
        <p className="app-page-subtitle">
          История действий по капиталу: редактирование, проверка и удаление
        </p>
      </div>

      {errorText && <div className="app-error-box">{errorText}</div>}

      <OperationsList
        cardClass="app-card"
        operations={operations}
        editingId={editingId}
        editingAmount={editingAmount}
        setEditingAmount={setEditingAmount}
        editingComment={editingComment}
        setEditingComment={setEditingComment}
        editingDate={editingDate}
        setEditingDate={setEditingDate}
        editingCategory={editingCategory}
        setEditingCategory={setEditingCategory}
        categories={[...ASSET_CATEGORIES]}
        commonInputClass="app-input"
        selectClass="app-select"
        formatNumber={formatNumber}
        startEditing={startEditing}
        cancelEditing={cancelEditing}
        saveEditedOperation={saveEditedOperation}
        deleteOperation={deleteOperation}
      />
    </div>
  );
}