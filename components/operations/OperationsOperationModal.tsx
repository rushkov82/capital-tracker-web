"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { ASSET_CATEGORIES } from "@/lib/constants";

type OperationsOperationModalProps = {
  open: boolean;
  amount: string;
  setAmount: (value: string) => void;
  comment: string;
  setComment: (value: string) => void;
  assetCategory: string;
  setAssetCategory: (value: string) => void;
  operationDate: string;
  setOperationDate: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  onDelete?: () => void;
  availableCategories: string[];
  saveDisabled: boolean;
};

export default function OperationsOperationModal({
  open,
  amount,
  setAmount,
  comment,
  setComment,
  assetCategory,
  setAssetCategory,
  operationDate,
  setOperationDate,
  onClose,
  onSubmit,
  onDelete,
  availableCategories,
  saveDisabled,
}: OperationsOperationModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  const categoryOptions = Array.from(
    new Set([
      ...ASSET_CATEGORIES,
      ...availableCategories,
      ...(assetCategory ? [assetCategory] : []),
    ])
  );

  const modalNode = (
    <div
      className="fixed inset-0 z-[200] overflow-y-auto overflow-x-hidden bg-black/30 p-3 md:flex md:items-center md:justify-center md:p-6"
      onClick={onClose}
    >
      <div
        className="mx-auto mt-10 mb-4 w-full max-w-[520px] overflow-hidden rounded-[18px] border border-[var(--border)] bg-[var(--background)] p-4 shadow-[0_20px_60px_rgba(15,23,42,0.18)] md:mt-0 md:p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="app-card-title">Редактирование операции</div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-[var(--border)] transition"
            style={{ color: "var(--text-secondary)" }}
            aria-label="Закрыть"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        <div className="space-y-4">
          <Field
            label="Сумма"
            hint="₽"
            control={
              <input
                className="app-input app-input-mobile-safe"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                inputMode="text"
                autoComplete="off"
              />
            }
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Категория"
              hint="Куда относится сумма"
              control={
                <select
                  className="app-input app-select app-input-mobile-safe"
                  value={assetCategory}
                  onChange={(e) => setAssetCategory(e.target.value)}
                >
                  <option value="">Выбери категорию</option>
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              }
            />

            <Field
              label="Дата"
              hint="Когда была операция"
              control={
                <input
                  type="date"
                  className="app-input app-input-mobile-safe app-date-input"
                  value={operationDate}
                  onChange={(e) => setOperationDate(e.target.value)}
                />
              }
            />
          </div>

          <Field
            label="Комментарий"
            hint="До 50 символов"
            control={
              <input
                className="app-input app-input-mobile-safe"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={50}
                autoComplete="off"
              />
            }
          />
        </div>

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            className="app-button"
            onClick={onSubmit}
            disabled={saveDisabled}
            style={{
              opacity: saveDisabled ? 0.55 : 1,
              cursor: saveDisabled ? "default" : "pointer",
            }}
          >
            Сохранить
          </button>

          {onDelete && (
            <button
              type="button"
              className="app-button-secondary"
              style={{ color: "var(--danger)" }}
              onClick={onDelete}
            >
              Удалить
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalNode, document.body);
}

function Field({
  label,
  hint,
  control,
}: {
  label: string;
  hint: string;
  control: React.ReactNode;
}) {
  return (
    <div className="space-y-1 min-w-0">
      <div className="app-form-row">
        <label className="app-form-label">{label}</label>
        <span className="app-form-hint">{hint}</span>
      </div>
      {control}
    </div>
  );
}