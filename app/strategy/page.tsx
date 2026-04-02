"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  fetchPlanSettings,
  upsertPlanSettings,
  type PlanSettings,
} from "@/lib/plan";
import { showToast } from "@/lib/toast";
import { calculateCapital } from "@/lib/calculations";
import {
  buildCompositionItems,
  detectDistributionMode,
  getYearsWord,
  type DistributionMode,
} from "@/lib/strategy";
import StrategyInfoBar from "@/components/strategy/StrategyInfoBar";
import StrategyResultCard from "@/components/strategy/StrategyResultCard";
import StrategyPlanForm from "@/components/strategy/StrategyPlanForm";
import StrategyDistributionCard from "@/components/strategy/StrategyDistributionCard";
import StrategyPortfolioCard from "@/components/strategy/StrategyPortfolioCard";

type SaveStatus = "idle" | "saving" | "saved" | "error";

export default function StrategyPage() {
  const [plan, setPlan] = useState<PlanSettings | null>(null);
  const [distributionMode, setDistributionMode] =
    useState<DistributionMode>("cash");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const hasLoadedRef = useRef(false);
  const saveTimeoutRef = useRef<number | null>(null);
  const resetStatusTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    const data = await fetchPlanSettings();
    setPlan(data);
    setDistributionMode(detectDistributionMode(data));
    hasLoadedRef.current = true;
  }

  function handlePlanChange(next: PlanSettings) {
    setPlan(next);
  }

  useEffect(() => {
    if (!hasLoadedRef.current || !plan) return;

    setSaveStatus("saving");

    if (saveTimeoutRef.current) {
      window.clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = window.setTimeout(async () => {
      try {
        await upsertPlanSettings(plan);
        setSaveStatus("saved");

        if (resetStatusTimeoutRef.current) {
          window.clearTimeout(resetStatusTimeoutRef.current);
        }

        resetStatusTimeoutRef.current = window.setTimeout(() => {
          setSaveStatus("idle");
        }, 1500);
      } catch {
        setSaveStatus("error");
        showToast({
          type: "error",
          title: "Ошибка",
          description: "Не удалось сохранить изменения",
        });
      }
    }, 500);

    return () => {
      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [plan]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current);
      }

      if (resetStatusTimeoutRef.current) {
        window.clearTimeout(resetStatusTimeoutRef.current);
      }
    };
  }, []);

  const result = useMemo(() => {
    if (!plan) return null;
    return calculateCapital(plan);
  }, [plan]);

  const compositionItems = useMemo(() => {
    if (!plan) return [];
    return buildCompositionItems(plan);
  }, [plan]);

  if (!plan) return null;

  return (
    <div className="space-y-4">
      <h1 className="app-page-title">Стратегия</h1>

      <StrategyInfoBar />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {result?.success && (
          <StrategyResultCard
            years={plan.years}
            nominalCapital={result.nominalCapital}
            realCapital={result.realCapital}
            portfolioRatePercent={result.portfolioRatePercent}
            getYearsWord={getYearsWord}
          />
        )}

        <StrategyPlanForm
          plan={plan}
          onChangePlan={handlePlanChange}
          saveStatusText={getSaveStatusText(saveStatus)}
          saveStatusColor={getSaveStatusColor(saveStatus)}
        />
      </div>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <StrategyDistributionCard
          plan={plan}
          distributionMode={distributionMode}
          setDistributionMode={setDistributionMode}
          onChangePlan={handlePlanChange}
        />

        <StrategyPortfolioCard
          items={compositionItems}
          portfolioRatePercent={
            result?.success ? result.portfolioRatePercent : undefined
          }
        />
      </section>
    </div>
  );
}

function getSaveStatusText(saveStatus: SaveStatus) {
  if (saveStatus === "saving") return "Сохраняем...";
  if (saveStatus === "saved") return "Сохранено";
  if (saveStatus === "error") return "Ошибка сохранения";
  return "";
}

function getSaveStatusColor(saveStatus: SaveStatus) {
  if (saveStatus === "saving") return "#9ca3af";
  if (saveStatus === "saved") return "#22c55e";
  if (saveStatus === "error") return "#ef4444";
  return "transparent";
}