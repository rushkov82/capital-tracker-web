"use client";

import { useEffect, useMemo, useState } from "react";
import { ASSET_CATEGORIES } from "@/lib/constants";
import { buildFactDistribution, getTotalFactAmount } from "@/lib/portfolio";
import {
  createOperation,
  fetchOperations,
  type Operation,
} from "@/lib/operations";
import ContributionForm from "@/components/ContributionForm";
import FactDistribution from "@/components/FactDistribution";
import OperationsList from "@/components/OperationsList";
import { formatNumber, formatPercent } from "@/lib/calculations";

export default function CapitalPage() {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [errorText, setErrorText] = useState("");

  const [actualContribution, setActualContribution] = useState("");
  const [contributionComment, setContributionComment] = useState("");
  const [contributionDate, setContributionDate] = useState(todayString());
  const [contributionCategory, setContributionCategory] = useState<string>(
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

  async function saveContribution() {
    setErrorText("");

    const amount = Number(actualContribution);

    if (!amount || Number.isNaN(amount) || amount <= 0) {
      setErrorText("Введите корректную сумму");
      return;
    }

    try {
      await createOperation({
        amount,
        comment: contributionComment,
        operation_date: contributionDate,
        asset_category: contributionCategory,
      });

      setActualContribution("");
      setContributionComment("");
      setContributionDate(todayString());
      setContributionCategory(ASSET_CATEGORIES[0]);

      await loadOperations();
    } catch (error) {
      console.log("Ошибка записи:", error);
      setErrorText(
        error instanceof Error ? error.message : "Ошибка сохранения"
      );
    }
  }

  const groupedFact = useMemo(() => {
    return buildFactDistribution(operations);
  }, [operations]);

  const totalFactAmount = useMemo(() => {
    return getTotalFactAmount(groupedFact);
  }, [groupedFact]);

  // 👇 показываем только последние 5 операций
  const recentOperations = useMemo(() => {
    return [...operations]
      .sort((a, b) => b.operation_date.localeCompare(a.operation_date))
      .slice(0, 5);
  }, [operations]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="app-page-title">Капитал</h1>
        <p className="app-page-subtitle">
          Реальные деньги, структура и контроль
        </p>
      </div>

      {errorText && <div className="app-error-box">{errorText}</div>}

      {/* FORM */}
      <ContributionForm
        cardClass="app-card"
        commonInputClass="app-input"
        selectClass="app-select"
        categories={[...ASSET_CATEGORIES]}
        actualContribution={actualContribution}
        setActualContribution={setActualContribution}
        contributionCategory={contributionCategory}
        setContributionCategory={setContributionCategory}
        contributionDate={contributionDate}
        setContributionDate={setContributionDate}
        contributionComment={contributionComment}
        setContributionComment={setContributionComment}
        onSave={saveContribution}
      />

      {/* DISTRIBUTION */}
      <FactDistribution
        cardClass="app-card"
        items={groupedFact}
        totalAmount={totalFactAmount}
        formatNumber={formatNumber}
        formatPercent={formatPercent}
      />

      {/* OPERATIONS */}
      <OperationsList
        cardClass="app-card"
        operations={recentOperations}
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

function todayString() {
  return new Date().toISOString().slice(0, 10);
}