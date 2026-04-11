import type { RefObject } from "react";

type ManualRowProps = {
  label: string;
  shareValue: string;
  returnValue: string;
  isCash: boolean;
  onChangeShare: (value: string) => void;
  onChangeReturn: (value: string) => void;
  onRemove?: () => void;
  shareInputRef?: RefObject<HTMLInputElement | null>;
  onShareEnter?: () => void;
};

export default function ManualRow({
  label,
  shareValue,
  returnValue,
  isCash,
  onChangeShare,
  onChangeReturn,
  onRemove,
  shareInputRef,
  onShareEnter,
}: ManualRowProps) {
  // CASH
  if (isCash) {
    return (
      <div className="pb-3 border-b border-[var(--border)] flex items-center justify-between">
        <div className="app-text-secondary">Свободный Cash</div>

        <div
          className="text-[18px] font-semibold"
          style={{ color: "var(--accent)" }}
        >
          {shareValue}%
        </div>
      </div>
    );
  }

  // ОБЫЧНАЯ СТРОКА
  return (
    <div className="flex items-end gap-2 w-full">
      {/* ДОЛЯ */}
      <div className="flex-1 min-w-0">
        <div className="app-field-caption truncate">
          {label} · доля (%)
        </div>
        <input
          ref={shareInputRef}
          className="app-input h-[32px]"
          value={shareValue}
          onFocus={(e) => e.target.select()}
          onChange={(e) => onChangeShare(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onShareEnter?.();
            }
          }}
        />
      </div>

      {/* ДОХОДНОСТЬ */}
      <div className="w-[120px] flex-shrink-0">
        <div className="app-field-caption truncate">
          Ожидаемая (%)
        </div>
        <input
          className="app-input h-[32px]"
          value={returnValue}
          onFocus={(e) => e.target.select()}
          onChange={(e) => onChangeReturn(e.target.value)}
        />
      </div>

      {/* КРЕСТИК */}
      <div className="flex items-center justify-center h-[32px] w-[32px] flex-shrink-0">
        <button
          type="button"
          onClick={onRemove}
          className="app-icon-button"
          aria-label="Удалить категорию"
          title="Удалить категорию"
        >
          <span className="app-icon-button-symbol">×</span>
        </button>
      </div>
    </div>
  );
}