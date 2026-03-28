"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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

  const recentOperations = useMemo(() => {
    return [...operations]
      .sort((a, b) => {
        const dateCompare = b.operation_date.localeCompare(a.operation_date);
        if (dateCompare !== 0) return dateCompare;
        return b.created_at.localeCompare(a.created_at);
      })
      .slice(0, 3);
  }, [operations]);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div>
          <h1 className="app-page-title">Капитал</h1>
          <p className="app-page-subtitle">
            Реальные деньги, история взносов и текущая структура
          </p>
        </div>

        <section className="app-card">
          <div className="app-text-small mb-1">Текущий капитал</div>
          <div className="text-[28px] leading-[32px] font-semibold text-[var(--accent)]">
            {formatNumber(totalFactAmount)} ₽
          </div>
        </section>
      </div>

      {errorText && <div className="app-error-box">{errorText}</div>}

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

      <section className="app-card">
        <h2 className="app-card-title mb-4">История взносов</h2>

        <OperationsList
          cardClass=""
          operations={recentOperations}
          formatNumber={formatNumber}
          onReload={loadOperations}
        />

        <div className="border-t border-[var(--border)] mt-4 pt-3">
          <div className="flex justify-end">
            <Link href="/history" className="app-button">
              Все операции →
            </Link>
          </div>
        </div>
      </section>

      <FactDistribution
        cardClass="app-card"
        items={groupedFact}
        totalAmount={totalFactAmount}
        formatNumber={formatNumber}
        formatPercent={formatPercent}
      />
    </div>
  );
}

function todayString() {
  return new Date().toISOString().slice(0, 10);
}