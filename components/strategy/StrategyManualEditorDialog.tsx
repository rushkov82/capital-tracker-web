"use client";

import type { ReactNode } from "react";
import StrategyManualEditorActions from "./StrategyManualEditorActions";

type StrategyManualEditorDialogProps = {
  visible: boolean;
  hasPendingChanges: boolean;
  onClose: () => void;
  onApply: () => void;
  children: ReactNode;
  readOnly?: boolean;
  title?: string;
  subtitle?: string;
};

export default function StrategyManualEditorDialog({
  visible,
  hasPendingChanges,
  onClose,
  onApply,
  children,
  readOnly = false,
  title,
  subtitle,
}: StrategyManualEditorDialogProps) {
  if (!visible) return null;

  const dialogTitle =
    title ?? (readOnly ? "Структура сценария" : "Настройка сценария «Свой»");

  const dialogSubtitle =
    subtitle ??
    (readOnly
      ? "Посмотри состав и ориентиры выбранного сценария."
      : "Настрой состав и ожидания отдельно, распределив Cash между категориями.");

  return (
    <div className="hidden lg:block">
      <div
        className="fixed inset-0 z-50 bg-[rgba(15,23,42,0.42)]"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
        <div
          className={`flex w-full max-w-[560px] flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-[0_24px_80px_rgba(0,0,0,0.28)] ${
            readOnly
              ? "max-h-[min(86vh,900px)]"
              : "h-[660px] max-h-[86vh]"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] px-6 py-4">
            <div className="min-w-0">
              <div className="app-card-title">{dialogTitle}</div>
              <div className="app-text-small mt-1">{dialogSubtitle}</div>
            </div>

            <button
              type="button"
              className="app-icon-button"
              onClick={onClose}
              aria-label={
                readOnly
                  ? "Закрыть просмотр структуры"
                  : "Закрыть настройку сценария"
              }
              title="Закрыть"
              style={{
                background: "rgba(148, 163, 184, 0.12)",
                color: "var(--text-muted)",
              }}
            >
              <span className="app-icon-button-symbol">×</span>
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
            {children}
          </div>

          <div className="px-6 py-3">
            {readOnly ? (
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  className="app-button-secondary"
                  onClick={onClose}
                >
                  Закрыть
                </button>

                <button
                  type="button"
                  className="app-button"
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
            ) : (
              <StrategyManualEditorActions
                hasPendingChanges={hasPendingChanges}
                onClose={onClose}
                onApply={onApply}
                applyLabel="Сохранить"
                closeLabel="Закрыть"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}