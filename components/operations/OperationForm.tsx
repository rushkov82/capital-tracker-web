"use client";

import { useEffect } from "react";
import { ArrowRightLeft, ArrowUpRight, Plus, RefreshCw } from "lucide-react";
import { ASSET_CATEGORIES } from "@/lib/constants";

export type OperationFormActionType =
  | "income"
  | "expense"
  | "adjustment"
  | "move";

type OperationFormProps = {
  amount: string;
  setAmount: (value: string) => void;
  comment: string;
  setComment: (value: string) => void;
  assetCategory: string;
  setAssetCategory: (value: string) => void;
  fromAssetCategory: string;
  setFromAssetCategory: (value: string) => void;
  toAssetCategory: string;
  setToAssetCategory: (value: string) => void;
  operationDate: string;
  setOperationDate: (value: string) => void;
  actionType: OperationFormActionType;
  setActionType: (value: OperationFormActionType) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  submitLabel?: string;
  showCancel?: boolean;
  hideActions?: boolean;
  availableCategories?: string[];
};

export default function OperationForm({
  amount,
  setAmount,
  comment,
  setComment,
  assetCategory,
  setAssetCategory,
  fromAssetCategory,
  setFromAssetCategory,
  toAssetCategory,
  setToAssetCategory,
  operationDate,
  setOperationDate,
  actionType,
  setActionType,
  onSubmit,
  onCancel,
  submitLabel = "Сохранить",
  showCancel = false,
  hideActions = false,
  availableCategories = [],
}: OperationFormProps) {
  const amountHint = actionType === "adjustment" ? "Плюс или минус" : "₽";

  const categories =
    actionType === "income"
      ? ASSET_CATEGORIES
      : availableCategories.length > 0
        ? availableCategories
        : [];

  useEffect(() => {
    if (actionType === "income" && !assetCategory) {
      setAssetCategory("Прочее");
    }
  }, [actionType, assetCategory, setAssetCategory]);

  function handleAmountFocus(e: React.FocusEvent<HTMLInputElement>) {
    if (typeof window === "undefined") return;

    const isDesktopLike = window.matchMedia("(pointer:fine)").matches;
    if (isDesktopLike) {
      e.target.select();
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 min-w-0">
      <div>
        <div className="grid grid-cols-4 gap-1.5">
          <Segment
            label="Пополнение"
            active={actionType === "income"}
            onClick={() => setActionType("income")}
            color="accent"
            icon={Plus}
          />
          <Segment
            label="Вывод"
            active={actionType === "expense"}
            onClick={() => setActionType("expense")}
            color="danger"
            icon={ArrowUpRight}
          />
          <Segment
            label="Переоценка"
            active={actionType === "adjustment"}
            onClick={() => setActionType("adjustment")}
            color="info"
            icon={RefreshCw}
          />
          <Segment
            label="Перемещение"
            active={actionType === "move"}
            onClick={() => setActionType("move")}
            color="neutral"
            icon={ArrowRightLeft}
          />
        </div>
      </div>

      <div className="min-h-[44px] flex flex-col justify-center">
        {actionType === "income" && (
          <>
            <div className="app-text-small">Добавление денег в капитал</div>
            <div className="app-text-small">
              Регулярные взносы — основа роста и накопления
            </div>
          </>
        )}

        {actionType === "expense" && (
          <>
            <div className="app-text-small">Вывод части капитала</div>
            <div className="app-text-small text-[var(--danger)]">
              Можно выводить только из существующей категории
            </div>
          </>
        )}

        {actionType === "adjustment" && (
          <>
            <div className="app-text-small">Изменение стоимости актива</div>
            <div className="app-text-small">
              Из категорий, которые есть в портфеле
            </div>
          </>
        )}

        {actionType === "move" && (
          <>
            <div className="app-text-small">Внутреннее перемещение капитала</div>
            <div className="app-text-small">Перенос суммы между категориями</div>
          </>
        )}
      </div>

      <div className="space-y-1 min-w-0">
        <div className="app-form-row">
          <label className="app-form-label">Сумма</label>
          <span className="app-form-hint">{amountHint}</span>
        </div>

        <input
          className="app-input app-input-mobile-safe"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onFocus={handleAmountFocus}
          placeholder=""
          inputMode="text"
          autoComplete="off"
        />
      </div>

      {actionType === "move" ? (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 min-w-0">
              <div className="app-form-row">
                <label className="app-form-label">Из категории</label>
              </div>

              <select
                className="app-input app-select app-input-mobile-safe"
                value={fromAssetCategory}
                onChange={(e) => setFromAssetCategory(e.target.value)}
              >
                <option value="">Выбери категорию</option>

                {availableCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1 min-w-0">
              <div className="app-form-row">
                <label className="app-form-label">В категорию</label>
              </div>

              <select
                className="app-input app-select app-input-mobile-safe"
                value={toAssetCategory}
                onChange={(e) => setToAssetCategory(e.target.value)}
              >
                <option value="">Выбери категорию</option>

                {ASSET_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1 min-w-0">
            <div className="app-form-row">
              <label className="app-form-label">Дата</label>
              <span className="app-form-hint">Когда была операция</span>
            </div>

            <input
              type="date"
              className="app-input app-input-mobile-safe app-date-input"
              value={operationDate}
              onChange={(e) => setOperationDate(e.target.value)}
            />
          </div>
        </>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1 min-w-0">
            <div className="app-form-row">
              <label className="app-form-label">Категория</label>
              <span className="app-form-hint">Куда относится сумма</span>
            </div>

            <select
              className="app-input app-select app-input-mobile-safe"
              value={assetCategory}
              onChange={(e) => setAssetCategory(e.target.value)}
            >
              {actionType !== "income" && (
                <option value="">Выбери существующую категорию</option>
              )}

              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1 min-w-0">
            <div className="app-form-row">
              <label className="app-form-label">Дата</label>
              <span className="app-form-hint">Когда была операция</span>
            </div>

            <input
              type="date"
              className="app-input app-input-mobile-safe app-date-input"
              value={operationDate}
              onChange={(e) => setOperationDate(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="space-y-1 min-w-0">
        <div className="app-form-row">
          <label className="app-form-label">Комментарий</label>
          <span className="app-form-hint">До 50 символов</span>
        </div>

        <input
          className="app-input app-input-mobile-safe"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder=""
          maxLength={50}
          autoComplete="off"
        />
      </div>

      {!hideActions && (
        <div className="mt-auto flex justify-end gap-2 pt-4">
          {showCancel && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="app-button-secondary"
            >
              Отмена
            </button>
          )}

          <button type="button" onClick={onSubmit} className="app-button">
            {submitLabel}
          </button>
        </div>
      )}
    </div>
  );
}

function Segment({
  label,
  active,
  onClick,
  color,
  icon: Icon,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  color: "accent" | "danger" | "info" | "neutral";
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
}) {
  const colorMap = {
    accent: "var(--accent)",
    danger: "var(--danger)",
    info: "var(--info)",
    neutral: "var(--text-secondary)",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[50px] w-full min-w-0 flex-col items-center justify-center gap-0.5 overflow-hidden rounded-[10px] px-1 text-[10px] font-medium leading-none transition-all duration-150 active:scale-[0.985] md:h-[42px] md:flex-row md:gap-1.5 md:px-1.5 md:text-[13px]"
      style={{
        background: active ? colorMap[color] : "transparent",
        color: active ? "#ffffff" : "var(--text-secondary)",
        opacity: active ? 1 : 0.8,
      }}
    >
      <span className="shrink-0">
        <Icon size={18} strokeWidth={2} />
      </span>
      <span className="min-w-0 truncate">{label}</span>
    </button>
  );
}
