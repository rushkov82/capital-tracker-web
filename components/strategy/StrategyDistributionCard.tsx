"use client";

import { createRef, useEffect, useMemo, useRef, useState } from "react";
import type { PlanSettings } from "@/lib/plan";
import type { DistributionMode } from "@/lib/strategy";
import {
  DEFAULT_CATEGORY_RETURNS,
  NON_CASH_KEYS,
  getDescriptor,
  toInt,
  type ManualCategoryKey,
} from "@/lib/strategy-distribution";
import ModeCardsGrid from "./distribution/ModeCardsGrid";
import ModeSummaryPanel from "./distribution/ModeSummaryPanel";
import {
  buildActivePlan,
  buildBalancedPlan,
  buildCashPlan,
  buildDistributionSignature,
  buildPlanForMode,
  buildVisibleKeysFromPlan,
  buildVisibleKeysSignature,
  formatPercent,
  getWeightedReturn,
} from "./distribution/distribution-helpers";
import StrategyManualEditorContent from "./StrategyManualEditorContent";
import StrategyManualEditorDialog from "./StrategyManualEditorDialog";
import StrategyManualEditorScreen from "./StrategyManualEditorScreen";

type Props = {
  plan: PlanSettings;
  appliedMode: DistributionMode;
  onApplyDistribution: (
    nextPlan: PlanSettings,
    nextMode: DistributionMode
  ) => void;
};

type AddableCategoryKey = Exclude<ManualCategoryKey, "cash">;

function getModeDescription(mode: DistributionMode) {
  if (mode === "cash") {
    return "Без вложений. Деньги остаются в быстром доступе и могут приносить процент, например, через краткосрочный вклад или накопительный счёт.";
  }

  if (mode === "balanced") {
    return "Сбалансированный вариант. Деньги распределяются между разными направлениями, чтобы снизить риск и со временем уверенно увеличивать капитал.";
  }

  if (mode === "active") {
    return "С акцентом на рост. Основной упор делается на акции, а остальные категории добавляются как опора, чтобы структура оставалась устойчивее и спокойнее в движении.";
  }

  return "Индивидуальная настройка. Ты сам решаешь, как распределить и вложить деньги, и можешь гибко настроить структуру портфеля и доходные ожидания.";
}

function getPreviewDialogTitle(mode: DistributionMode) {
  if (mode === "cash") return "Структура сценария «Только Cash»";
  if (mode === "balanced") return "Структура сценария «Оптимум»";
  if (mode === "active") return "Структура сценария «Активный»";
  return "Структура сценария «Свой»";
}

function getPreviewDialogSubtitle(mode: DistributionMode) {
  if (mode === "manual") {
    return "Посмотри текущую структуру и ориентиры ручного сценария.";
  }

  return "Посмотри состав и ориентиры выбранного сценария.";
}

function buildPreviewPlan(
  mode: DistributionMode,
  plan: PlanSettings,
  manualDraftPlan: PlanSettings
) {
  if (mode === "cash") return buildCashPlan(plan);
  if (mode === "balanced") return buildBalancedPlan(plan);
  if (mode === "active") return buildActivePlan(plan);
  return manualDraftPlan;
}

export default function StrategyDistributionCard({
  plan,
  appliedMode,
  onApplyDistribution,
}: Props) {
  const [selectedMode, setSelectedMode] =
    useState<DistributionMode>(appliedMode);

  const [manualDraftPlan, setManualDraftPlan] = useState<PlanSettings>(plan);
  const [manualSavedPlan, setManualSavedPlan] = useState<PlanSettings>(plan);

  const [visibleKeys, setVisibleKeys] = useState<ManualCategoryKey[]>(["cash"]);
  const [manualSavedVisibleKeys, setManualSavedVisibleKeys] = useState<
    ManualCategoryKey[]
  >(["cash"]);

  const [isManualEditorOpen, setIsManualEditorOpen] = useState(false);
  const [isStructurePreviewOpen, setIsStructurePreviewOpen] = useState(false);

  const shareInputRefs = useRef<
    Partial<Record<ManualCategoryKey, React.RefObject<HTMLInputElement | null>>>
  >({});

  const previousAppliedSignatureRef = useRef("");
  const previousAppliedModeRef = useRef<DistributionMode>(appliedMode);

  const appliedSignature = useMemo(
    () => buildDistributionSignature(plan),
    [plan]
  );
  const manualDraftSignature = useMemo(
    () => buildDistributionSignature(manualDraftPlan),
    [manualDraftPlan]
  );
  const manualSavedSignature = useMemo(
    () => buildDistributionSignature(manualSavedPlan),
    [manualSavedPlan]
  );
  const visibleKeysSignature = useMemo(
    () => buildVisibleKeysSignature(visibleKeys),
    [visibleKeys]
  );
  const manualSavedVisibleKeysSignature = useMemo(
    () => buildVisibleKeysSignature(manualSavedVisibleKeys),
    [manualSavedVisibleKeys]
  );

  const manualCashShare = toInt(getDescriptor("cash").getShare(manualDraftPlan));

  const cashYieldText = useMemo(
    () => `${formatPercent(getWeightedReturn(buildCashPlan(plan)))} %`,
    [plan]
  );
  const balancedYieldText = useMemo(
    () => `${formatPercent(getWeightedReturn(buildBalancedPlan(plan)))} %`,
    [plan]
  );
  const activeYieldText = useMemo(
    () => `${formatPercent(getWeightedReturn(buildActivePlan(plan)))} %`,
    [plan]
  );
  const manualYieldText = useMemo(
    () => `${formatPercent(getWeightedReturn(manualDraftPlan))} %`,
    [manualDraftPlan]
  );

  const summaryDescription = useMemo(
    () => getModeDescription(selectedMode),
    [selectedMode]
  );

  const previewPlan = useMemo(
    () => buildPreviewPlan(selectedMode, plan, manualDraftPlan),
    [manualDraftPlan, plan, selectedMode]
  );

  const previewVisibleKeys = useMemo(() => {
    if (selectedMode === "manual") {
      return visibleKeys;
    }

    return buildVisibleKeysFromPlan(previewPlan);
  }, [previewPlan, selectedMode, visibleKeys]);

  const previewEditableKeys = useMemo<AddableCategoryKey[]>(
    () =>
      previewVisibleKeys.filter(
        (key) => key !== "cash"
      ) as AddableCategoryKey[],
    [previewVisibleKeys]
  );

  const previewCashShare = useMemo(
    () => toInt(getDescriptor("cash").getShare(previewPlan)),
    [previewPlan]
  );

  const previewDialogTitle = useMemo(
    () => getPreviewDialogTitle(selectedMode),
    [selectedMode]
  );

  const previewDialogSubtitle = useMemo(
    () => getPreviewDialogSubtitle(selectedMode),
    [selectedMode]
  );

  const availableOptions = useMemo<AddableCategoryKey[]>(
    () =>
      NON_CASH_KEYS.filter(
        (key) => !visibleKeys.includes(key)
      ) as AddableCategoryKey[],
    [visibleKeys]
  );

  const editableKeys = useMemo<AddableCategoryKey[]>(
    () =>
      visibleKeys.filter((key) => key !== "cash") as AddableCategoryKey[],
    [visibleKeys]
  );

  const hasPendingChanges = useMemo(() => {
    if (selectedMode !== appliedMode) return true;

    if (selectedMode === "manual") {
      return (
        manualDraftSignature !== manualSavedSignature ||
        visibleKeysSignature !== manualSavedVisibleKeysSignature
      );
    }

    return false;
  }, [
    appliedMode,
    manualDraftSignature,
    manualSavedSignature,
    manualSavedVisibleKeysSignature,
    selectedMode,
    visibleKeysSignature,
  ]);

  const manualEditorHasPendingChanges = useMemo(() => {
    if (appliedMode !== "manual") return true;

    return (
      manualDraftSignature !== manualSavedSignature ||
      visibleKeysSignature !== manualSavedVisibleKeysSignature
    );
  }, [
    appliedMode,
    manualDraftSignature,
    manualSavedSignature,
    manualSavedVisibleKeysSignature,
    visibleKeysSignature,
  ]);

  useEffect(() => {
    const appliedChanged =
      appliedSignature !== previousAppliedSignatureRef.current ||
      appliedMode !== previousAppliedModeRef.current;

    if (!appliedChanged) return;

    const isManualSaveRefresh =
      appliedMode === "manual" &&
      previousAppliedModeRef.current === "manual" &&
      isManualEditorOpen;

    setSelectedMode(appliedMode);

    if (!isManualSaveRefresh) {
      setIsManualEditorOpen(false);
    }

    setIsStructurePreviewOpen(false);

    const keysFromAppliedPlan = buildVisibleKeysFromPlan(plan);

    if (appliedMode === "manual") {
      setManualDraftPlan(plan);
      setManualSavedPlan(plan);
      setVisibleKeys(keysFromAppliedPlan);
      setManualSavedVisibleKeys(keysFromAppliedPlan);
    } else if (!previousAppliedSignatureRef.current) {
      setManualDraftPlan(plan);
      setManualSavedPlan(plan);
      setVisibleKeys(keysFromAppliedPlan);
      setManualSavedVisibleKeys(keysFromAppliedPlan);
    }

    previousAppliedSignatureRef.current = appliedSignature;
    previousAppliedModeRef.current = appliedMode;
  }, [appliedMode, appliedSignature, isManualEditorOpen, plan]);

  useEffect(() => {
    const keysFromDraft: ManualCategoryKey[] = ["cash"];

    for (const key of NON_CASH_KEYS) {
      if (toInt(getDescriptor(key).getShare(manualDraftPlan)) > 0) {
        keysFromDraft.push(key);
      }
    }

    setVisibleKeys((prev) => {
      const merged = [...new Set([...prev, ...keysFromDraft])];

      const cleaned = merged.filter((key) => {
        if (key === "cash") return true;
        return (
          toInt(getDescriptor(key).getShare(manualDraftPlan)) > 0 ||
          prev.includes(key)
        );
      });

      return cleaned.length ? cleaned : ["cash"];
    });
  }, [manualDraftPlan]);

  useEffect(() => {
    if (!isManualEditorOpen && !isStructurePreviewOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isManualEditorOpen, isStructurePreviewOpen]);

  for (const key of editableKeys) {
    if (!shareInputRefs.current[key]) {
      shareInputRefs.current[key] = createRef<HTMLInputElement>();
    }
  }

  function updateManualDraftPlan(next: PlanSettings) {
    setManualDraftPlan(next);
    setSelectedMode("manual");
  }

  function resetTransientUi() {
    setIsManualEditorOpen(false);
    setIsStructurePreviewOpen(false);
  }

  function handleAddCategory(key: AddableCategoryKey) {
    if (visibleKeys.includes(key)) return;

    const descriptor = getDescriptor(key);

    let nextPlan = manualDraftPlan;
    nextPlan = descriptor.setReturn(
      nextPlan,
      DEFAULT_CATEGORY_RETURNS[key] || "0"
    );
    nextPlan = descriptor.setShare(nextPlan, "0");

    setVisibleKeys((prev) => [...prev, key]);
    updateManualDraftPlan(nextPlan);
  }

  function handleChange(key: ManualCategoryKey, raw: string) {
    if (key === "cash") return;

    const descriptor = getDescriptor(key);
    const current = toInt(descriptor.getShare(manualDraftPlan));
    const next = Math.min(toInt(raw), current + manualCashShare);
    const delta = next - current;

    let nextPlan = descriptor.setShare(manualDraftPlan, String(next));
    nextPlan = getDescriptor("cash").setShare(
      nextPlan,
      String(manualCashShare - delta)
    );

    updateManualDraftPlan(nextPlan);
  }

  function handleRemove(key: ManualCategoryKey) {
    const descriptor = getDescriptor(key);
    const share = toInt(descriptor.getShare(manualDraftPlan));

    let nextPlan = descriptor.setShare(manualDraftPlan, "0");
    nextPlan = getDescriptor("cash").setShare(
      nextPlan,
      String(manualCashShare + share)
    );

    setVisibleKeys((prev) => prev.filter((k) => k !== key));
    updateManualDraftPlan(nextPlan);
  }

  function handleReturn(key: ManualCategoryKey, value: string) {
    updateManualDraftPlan(getDescriptor(key).setReturn(manualDraftPlan, value));
  }

  function handleSelectMode(mode: DistributionMode) {
    setSelectedMode(mode);
    resetTransientUi();

    if (mode === "manual" && !visibleKeys.length) {
      setVisibleKeys(["cash"]);
    }
  }

  function handleApplySelectedMode() {
    if (selectedMode === "manual") {
      const nextPlan = buildPlanForMode(plan, "manual", manualSavedPlan);
      onApplyDistribution(nextPlan, "manual");
      return;
    }

    const nextPlan = buildPlanForMode(plan, selectedMode, manualDraftPlan);
    onApplyDistribution(nextPlan, selectedMode);
  }

  function handleApplyManualMode() {
    const nextPlan = buildPlanForMode(plan, "manual", manualDraftPlan);

    setManualSavedPlan(nextPlan);
    setManualDraftPlan(nextPlan);
    setManualSavedVisibleKeys(visibleKeys);

    onApplyDistribution(nextPlan, "manual");
  }

  function handleCloseManualEditor() {
    setManualDraftPlan(manualSavedPlan);
    setVisibleKeys(manualSavedVisibleKeys);
    setIsManualEditorOpen(false);
  }

  function focusNextShareField(currentKey: AddableCategoryKey) {
    const currentIndex = editableKeys.indexOf(currentKey);
    if (currentIndex === -1) return;

    const nextKey = editableKeys[currentIndex + 1];

    if (!nextKey) return;

    const nextRef = shareInputRefs.current[nextKey];
    nextRef?.current?.focus();
    nextRef?.current?.select();
  }

  function openManualEditor() {
    setSelectedMode("manual");
    setIsManualEditorOpen(true);
    setIsStructurePreviewOpen(false);
  }

  function openStructurePreview() {
    if (selectedMode === "manual") {
      openManualEditor();
      return;
    }

    setIsStructurePreviewOpen(true);
    setIsManualEditorOpen(false);
  }

  function closeStructurePreview() {
    setIsStructurePreviewOpen(false);
  }

  return (
    <>
      <section className="app-card">
        <div className="app-card-stack">
          <div className="flex flex-col gap-[2px]">
            <div className="app-card-title">Как ты распределишь деньги</div>
            <div className="app-text-small text-[var(--text-muted)]">
              Выбери сценарий, по которому ты будешь копить и распределять деньги
            </div>
          </div>

          <ModeCardsGrid
            appliedMode={appliedMode}
            selectedMode={selectedMode}
            cashYieldText={cashYieldText}
            balancedYieldText={balancedYieldText}
            activeYieldText={activeYieldText}
            manualYieldText={manualYieldText}
            summaryDescription={summaryDescription}
            hasPendingChanges={hasPendingChanges}
            onSelectMode={handleSelectMode}
            onApply={handleApplySelectedMode}
            onOpenPreview={openStructurePreview}
          />

          <ModeSummaryPanel
            selectedMode={selectedMode}
            description={summaryDescription}
            hasPendingChanges={hasPendingChanges}
            onApply={handleApplySelectedMode}
            onOpenPreview={openStructurePreview}
          />
        </div>
      </section>

      <StrategyManualEditorDialog
        visible={isManualEditorOpen}
        hasPendingChanges={manualEditorHasPendingChanges}
        onClose={handleCloseManualEditor}
        onApply={handleApplyManualMode}
      >
        <StrategyManualEditorContent
          cashShare={manualCashShare}
          editableKeys={editableKeys}
          draftPlan={manualDraftPlan}
          shareInputRefs={shareInputRefs.current}
          onShareEnter={focusNextShareField}
          onChangeShare={handleChange}
          onChangeReturn={handleReturn}
          onRemove={handleRemove}
          availableOptions={availableOptions}
          onAddCategory={handleAddCategory}
        />
      </StrategyManualEditorDialog>

      <StrategyManualEditorScreen
        visible={isManualEditorOpen}
        hasPendingChanges={manualEditorHasPendingChanges}
        onClose={handleCloseManualEditor}
        onApply={handleApplyManualMode}
      >
        <StrategyManualEditorContent
          cashShare={manualCashShare}
          editableKeys={editableKeys}
          draftPlan={manualDraftPlan}
          shareInputRefs={shareInputRefs.current}
          onShareEnter={focusNextShareField}
          onChangeShare={handleChange}
          onChangeReturn={handleReturn}
          onRemove={handleRemove}
          availableOptions={availableOptions}
          onAddCategory={handleAddCategory}
        />
      </StrategyManualEditorScreen>

      <StrategyManualEditorDialog
        visible={isStructurePreviewOpen}
        hasPendingChanges={hasPendingChanges}
        onClose={closeStructurePreview}
        onApply={handleApplySelectedMode}
        readOnly
        title={previewDialogTitle}
        subtitle={previewDialogSubtitle}
      >
        <StrategyManualEditorContent
          cashShare={previewCashShare}
          editableKeys={previewEditableKeys}
          draftPlan={previewPlan}
          shareInputRefs={{}}
          onShareEnter={() => {}}
          onChangeShare={() => {}}
          onChangeReturn={() => {}}
          onRemove={() => {}}
          availableOptions={[]}
          onAddCategory={() => {}}
          readOnly
        />
      </StrategyManualEditorDialog>

      <StrategyManualEditorScreen
        visible={isStructurePreviewOpen}
        hasPendingChanges={hasPendingChanges}
        onClose={closeStructurePreview}
        onApply={handleApplySelectedMode}
        readOnly
        title={previewDialogTitle}
        subtitle={previewDialogSubtitle}
      >
        <StrategyManualEditorContent
          cashShare={previewCashShare}
          editableKeys={previewEditableKeys}
          draftPlan={previewPlan}
          shareInputRefs={{}}
          onShareEnter={() => {}}
          onChangeShare={() => {}}
          onChangeReturn={() => {}}
          onRemove={() => {}}
          availableOptions={[]}
          onAddCategory={() => {}}
          readOnly
        />
      </StrategyManualEditorScreen>
    </>
  );
}