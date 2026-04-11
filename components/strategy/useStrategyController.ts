"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { upsertPlanSettings, type PlanSettings } from "@/lib/plan";
import { showToast } from "@/lib/toast";
import { calculateCapital } from "@/lib/calculations";
import {
  buildCompositionItems,
  detectDistributionMode,
  type DistributionMode,
} from "@/lib/strategy";
import { useCoreData } from "@/components/core/CoreDataProvider";

type SaveStatus = "idle" | "saving" | "saved" | "error";

export function useStrategyController() {
  const { plan, setPlan, isLoading } = useCoreData();

  const [appliedDistributionMode, setAppliedDistributionMode] =
    useState<DistributionMode>("cash");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [showFloatingSummary, setShowFloatingSummary] = useState(false);

  const saveTimeoutRef = useRef<number | null>(null);
  const resetStatusTimeoutRef = useRef<number | null>(null);
  const hasInitializedPlanRef = useRef(false);
  const hasInitializedModeRef = useRef(false);
  const desktopResultCardRef = useRef<HTMLDivElement | null>(null);
  const mobileResultCardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target =
      window.innerWidth >= 1024
        ? desktopResultCardRef.current
        : mobileResultCardRef.current;

    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowFloatingSummary(!entry.isIntersecting);
      },
      {
        threshold: 0.2,
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [plan]);

  useEffect(() => {
    if (!plan || hasInitializedModeRef.current) return;
    setAppliedDistributionMode(detectDistributionMode(plan));
    hasInitializedModeRef.current = true;
  }, [plan]);

  useEffect(() => {
    if (!plan) return;

    if (!hasInitializedPlanRef.current) {
      hasInitializedPlanRef.current = true;
      return;
    }

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

  function handlePlanChange(next: PlanSettings) {
    setPlan(next);
  }

  function handleApplyDistribution(
    nextPlan: PlanSettings,
    nextMode: DistributionMode
  ) {
    setAppliedDistributionMode(nextMode);
    setPlan(nextPlan);
  }

  const result = useMemo(() => {
    if (!plan) return null;
    return calculateCapital(plan);
  }, [plan]);

  const compositionItems = useMemo(() => {
    if (!plan) return [];
    return buildCompositionItems(plan);
  }, [plan]);

  return {
    plan,
    isLoading,
    appliedDistributionMode,
    saveStatus,
    showFloatingSummary,
    result,
    compositionItems,
    desktopResultCardRef,
    mobileResultCardRef,
    handlePlanChange,
    handleApplyDistribution,
  };
}

export function getSaveStatusText(saveStatus: SaveStatus) {
  if (saveStatus === "saving") return "Сохраняем...";
  if (saveStatus === "saved") return "Сохранено";
  if (saveStatus === "error") return "Ошибка сохранения";
  return "";
}

export function getSaveStatusColor(saveStatus: SaveStatus) {
  if (saveStatus === "saving") return "#9ca3af";
  if (saveStatus === "saved") return "#22c55e";
  if (saveStatus === "error") return "#ef4444";
  return "transparent";
}