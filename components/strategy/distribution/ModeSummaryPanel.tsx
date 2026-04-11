import type { DistributionMode } from "@/lib/strategy";

type ModeSummaryPanelProps = {
  selectedMode: DistributionMode;
  description: string;
  hasPendingChanges: boolean;
  onApply: () => void;
  onOpenPreview: () => void;
};

export default function ModeSummaryPanel({
  description,
  hasPendingChanges,
  onApply,
  onOpenPreview,
}: ModeSummaryPanelProps) {
  return (
    <div className="hidden px-2 pt-1 pb-0 md:block">
      <div className="flex min-h-[56px] items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="max-w-[680px] text-[12px] leading-[16px] text-[var(--text-muted)]">
            {description}
          </div>
        </div>

        <div className="flex items-center gap-2">
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