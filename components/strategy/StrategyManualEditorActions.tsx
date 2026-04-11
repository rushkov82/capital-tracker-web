type StrategyManualEditorActionsProps = {
  hasPendingChanges: boolean;
  onClose: () => void;
  onApply: () => void;
  applyLabel?: string;
  closeLabel?: string;
  fullWidth?: boolean;
};

export default function StrategyManualEditorActions({
  hasPendingChanges,
  onClose,
  onApply,
  applyLabel = "Применить",
  closeLabel = "Закрыть",
  fullWidth = false,
}: StrategyManualEditorActionsProps) {
  return (
    <div
      className={
        fullWidth
          ? "flex items-center gap-2"
          : "flex items-center justify-end gap-2"
      }
    >
      <button
        type="button"
        className={fullWidth ? "app-button-secondary flex-1" : "app-button-secondary"}
        onClick={onClose}
      >
        {closeLabel}
      </button>

      <button
        type="button"
        className={fullWidth ? "app-button flex-1" : "app-button"}
        onClick={onApply}
        disabled={!hasPendingChanges}
        style={{
          background: hasPendingChanges ? "var(--accent)" : "transparent",
          color: hasPendingChanges ? "#ffffff" : "var(--text-muted)",
          borderColor: hasPendingChanges ? "var(--accent)" : "var(--border)",
          opacity: hasPendingChanges ? 1 : 0.6,
          cursor: hasPendingChanges ? "pointer" : "default",
        }}
      >
        {applyLabel}
      </button>
    </div>
  );
}