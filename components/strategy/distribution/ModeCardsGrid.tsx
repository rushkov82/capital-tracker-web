import type { DistributionMode } from "@/lib/strategy";
import ModeCard from "@/components/strategy/distribution/ModeCard";

type ModeCardsGridProps = {
  appliedMode: DistributionMode;
  selectedMode: DistributionMode;
  cashYieldText: string;
  balancedYieldText: string;
  activeYieldText: string;
  manualYieldText: string;
  summaryDescription: string;
  hasPendingChanges: boolean;
  onSelectMode: (mode: DistributionMode) => void;
  onApply: () => void;
  onOpenPreview: () => void;
};

type MobileSummaryProps = {
  visible: boolean;
  description: string;
  hasPendingChanges: boolean;
  onApply: () => void;
  onOpenPreview: () => void;
};

function MobileModeSummary({
  visible,
  description,
  hasPendingChanges,
  onApply,
  onOpenPreview,
}: MobileSummaryProps) {
  if (!visible) return null;

  return (
    <div className="px-2 pt-2 pb-0 md:hidden">
      <div className="flex flex-col gap-3">
        <div className="text-[12px] leading-[16px] text-[var(--text-muted)]">
          {description}
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            className="app-button-secondary whitespace-nowrap"
            onClick={onOpenPreview}
          >
            Посмотреть
          </button>

          <button
            type="button"
            className="app-button whitespace-nowrap"
            onClick={onApply}
            disabled={!hasPendingChanges}
            style={{
              background: hasPendingChanges ? "var(--accent)" : "transparent",
              color: hasPendingChanges ? "#ffffff" : "var(--text-muted)",
              borderColor: hasPendingChanges
                ? "var(--accent)"
                : "var(--border)",
              opacity: hasPendingChanges ? 1 : 0.6,
              cursor: hasPendingChanges ? "pointer" : "default",
            }}
          >
            Применить
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ModeCardsGrid({
  appliedMode,
  selectedMode,
  cashYieldText,
  balancedYieldText,
  activeYieldText,
  manualYieldText,
  summaryDescription,
  hasPendingChanges,
  onSelectMode,
  onApply,
  onOpenPreview,
}: ModeCardsGridProps) {
  const modeItems: Array<{
    mode: DistributionMode;
    title: string;
    description: string;
    yieldText: string;
  }> = [
    {
      mode: "cash",
      title: "Только Cash",
      description: "Простой режим без структуры",
      yieldText: cashYieldText,
    },
    {
      mode: "balanced",
      title: "Оптимум",
      description: "Готовая базовая структура портфеля",
      yieldText: balancedYieldText,
    },
    {
      mode: "active",
      title: "Активный",
      description: "Структура с акцентом на рост",
      yieldText: activeYieldText,
    },
    {
      mode: "manual",
      title: "Свой",
      description: "Своя структура и свои ожидания",
      yieldText: manualYieldText,
    },
  ];

  return (
    <div className="app-mode-grid md:grid-cols-4">
      {modeItems.map((item) => (
        <div key={item.mode}>
          <ModeCard
            title={item.title}
            description={item.description}
            yieldText={item.yieldText}
            isApplied={appliedMode === item.mode}
            isSelected={selectedMode === item.mode}
            onClick={() => onSelectMode(item.mode)}
          />

          <MobileModeSummary
            visible={selectedMode === item.mode}
            description={summaryDescription}
            hasPendingChanges={hasPendingChanges}
            onApply={onApply}
            onOpenPreview={onOpenPreview}
          />
        </div>
      ))}
    </div>
  );
}