"use client";

import type { ReactNode } from "react";
import StrategyManualEditorActions from "./StrategyManualEditorActions";

type StrategyManualEditorScreenProps = {
  visible: boolean;
  hasPendingChanges: boolean;
  onClose: () => void;
  onApply: () => void;
  children: ReactNode;
  readOnly?: boolean;
  title?: string;
  subtitle?: string;
};

export default function StrategyManualEditorScreen({
  visible,
  hasPendingChanges,
  onClose,
  onApply,
  children,
  readOnly = false,
  title,
  subtitle,
}: StrategyManualEditorScreenProps) {
  if (!visible) return null;

  const screenTitle =
    title ?? (readOnly ? "Структура сценария" : "Настройка сценария «Свой»");

  const screenSubtitle =
    subtitle ??
    (readOnly
      ? "Посмотри состав и ориентиры выбранного сценария."
      : "Настрой состав и ожидания отдельно, распределив Cash между категориями.");

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-[var(--background)] lg:hidden">
      <div className="border-b border-[var(--border)] px-4 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="app-card-title">{screenTitle}</div>
            <div className="app-text-small mt-1">{screenSubtitle}</div>
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
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {children}
      </div>

      <div
        className="border-t border-[var(--border)] bg-[var(--card)] px-4 py-4"
        style={{
          paddingBottom: "calc(16px + env(safe-area-inset-bottom, 0px))",
        }}
      >
        {readOnly ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="app-button-secondary flex-1"
              onClick={onClose}
            >
              Закрыть
            </button>

            <button
              type="button"
              className="app-button flex-1"
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
            fullWidth
          />
        )}
      </div>
    </div>
  );
}