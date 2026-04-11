"use client";

import type { PlanSettings } from "@/lib/plan";
import {
  getDescriptor,
  toInt,
  type ManualCategoryKey,
} from "@/lib/strategy-distribution";

type AddableCategoryKey = Exclude<ManualCategoryKey, "cash">;

type StrategyManualEditorContentProps = {
  cashShare: number;
  editableKeys: AddableCategoryKey[];
  draftPlan: PlanSettings;
  shareInputRefs: Partial<
    Record<ManualCategoryKey, React.RefObject<HTMLInputElement | null>>
  >;
  onShareEnter: (key: AddableCategoryKey) => void;
  onChangeShare: (key: ManualCategoryKey, value: string) => void;
  onChangeReturn: (key: ManualCategoryKey, value: string) => void;
  onRemove: (key: ManualCategoryKey) => void;
  availableOptions: AddableCategoryKey[];
  onAddCategory: (key: AddableCategoryKey) => void;
  readOnly?: boolean;
};

const editableRowGridClassName =
  "grid-cols-[minmax(0,1fr)_90px_90px_34px] lg:grid-cols-[minmax(0,1fr)_100px_100px_34px]";
const readOnlyRowGridClassName =
  "grid-cols-[minmax(0,1fr)_90px_90px] lg:grid-cols-[minmax(0,1fr)_100px_100px]";

type CompactStepperFieldProps = {
  value: string;
  readOnly?: boolean;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  ariaLabelMinus: string;
  ariaLabelPlus: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
};

function sanitizePercentLikeValue(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  return String(Math.min(Number(digits), 100));
}

function stepPercentLikeValue(current: string, delta: number): string {
  const numeric = toInt(current);
  const next = Math.max(0, Math.min(100, numeric + delta));
  return next === 0 ? "" : String(next);
}

function CompactStepperField({
  value,
  readOnly = false,
  inputRef,
  ariaLabelMinus,
  ariaLabelPlus,
  onChange,
  onEnter,
}: CompactStepperFieldProps) {
  const numericValue = toInt(value);
  const isMinusDisabled = numericValue <= 0;
  const isPlusDisabled = numericValue >= 100;

  function handleStep(delta: number) {
    onChange(stepPercentLikeValue(value, delta));
  }

  if (readOnly) {
    return (
      <div className="relative w-full">
        <div className="flex h-[34px] w-full items-center rounded-[10px] border border-[var(--border)] bg-transparent px-[30px]">
          <div className="w-full text-center text-[13px] leading-[34px] text-[var(--text-primary)] opacity-70">
            {value}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        inputMode="numeric"
        className="h-[34px] w-full rounded-[10px] border border-[var(--border)] bg-transparent px-[28px] text-center text-[13px] leading-[34px] text-[var(--text-primary)] outline-none appearance-none"
        value={value}
        onFocus={(e) => e.target.select()}
        onChange={(e) => onChange(sanitizePercentLikeValue(e.target.value))}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onEnter?.();
          }
        }}
      />

      <div
        className="pointer-events-none absolute left-[28px] top-1/2 h-[18px] w-px -translate-y-1/2 bg-[var(--border)] opacity-60"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-[28px] top-1/2 h-[18px] w-px -translate-y-1/2 bg-[var(--border)] opacity-60"
        aria-hidden="true"
      />

      <button
        type="button"
        className="absolute left-0 top-0 flex h-[34px] w-[28px] items-center justify-center rounded-l-[10px] bg-transparent text-[16px] font-semibold leading-none text-[var(--text-secondary)] transition hover:bg-[rgba(148,163,184,0.08)] disabled:cursor-not-allowed disabled:opacity-40"
        onClick={() => handleStep(-1)}
        disabled={isMinusDisabled}
        aria-label={ariaLabelMinus}
        title="Уменьшить"
      >
        −
      </button>

      <button
        type="button"
        className="absolute right-0 top-0 flex h-[34px] w-[28px] items-center justify-center rounded-r-[10px] bg-transparent text-[16px] font-semibold leading-none text-[var(--text-secondary)] transition hover:bg-[rgba(148,163,184,0.08)] disabled:cursor-not-allowed disabled:opacity-40"
        onClick={() => handleStep(1)}
        disabled={isPlusDisabled}
        aria-label={ariaLabelPlus}
        title="Увеличить"
      >
        +
      </button>
    </div>
  );
}

export default function StrategyManualEditorContent({
  cashShare,
  editableKeys,
  draftPlan,
  shareInputRefs,
  onShareEnter,
  onChangeShare,
  onChangeReturn,
  onRemove,
  availableOptions,
  onAddCategory,
  readOnly = false,
}: StrategyManualEditorContentProps) {
  const rowGridClassName = readOnly
    ? readOnlyRowGridClassName
    : editableRowGridClassName;

  const isCashOnlyReadOnly = readOnly && editableKeys.length === 0;

  return (
    <div className={`app-card-stack ${isCashOnlyReadOnly ? "gap-0" : "gap-3"}`}>
      <div
        className={`flex min-w-0 items-center justify-between gap-[12px] ${
          isCashOnlyReadOnly ? "pb-[2px]" : "pb-[10px]"
        }`}
      >
        <div className="app-text-secondary">Свободный Cash в сценарии</div>

        <div
          className="font-semibold leading-[18px]"
          style={{ color: "var(--accent)" }}
        >
          {cashShare}%
        </div>
      </div>

      {!isCashOnlyReadOnly ? (
        <div className="app-card-stack gap-0">
          {editableKeys.map((key, index) => {
            const descriptor = getDescriptor(key);
            const shareValue = descriptor.getShare(draftPlan);
            const returnValue = descriptor.getReturn(draftPlan);
            const showLabels = index === 0;

            return (
              <div key={key} className={`grid ${rowGridClassName} gap-2`}>
                <div className="flex min-w-0 flex-col">
                  {showLabels ? (
                    <div className="invisible mb-[10px] whitespace-nowrap text-[11px] leading-[11px]">
                      Актив
                    </div>
                  ) : null}

                  <div className="flex h-[36px] min-w-0 items-end">
                    <div className="mr-[10px] flex h-[34px] w-full min-w-0 items-center border-b border-[var(--border)]">
                      <div className="truncate text-[14px] leading-[14px] font-medium text-[var(--text-secondary)]">
                        {descriptor.label}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col">
                  {showLabels ? (
                    <div className="mb-[10px] whitespace-nowrap text-center text-[11px] leading-[11px] text-[var(--text-muted)]">
                      Доля (%)
                    </div>
                  ) : null}

                  <div className="flex h-[36px] items-end">
                    <CompactStepperField
                      value={shareValue}
                      readOnly={readOnly}
                      inputRef={shareInputRefs[key]}
                      ariaLabelMinus={`Уменьшить долю категории ${descriptor.label}`}
                      ariaLabelPlus={`Увеличить долю категории ${descriptor.label}`}
                      onChange={(nextValue) => onChangeShare(key, nextValue)}
                      onEnter={() => onShareEnter(key)}
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  {showLabels ? (
                    <div className="mb-[10px] whitespace-nowrap text-center text-[11px] leading-[11px] text-[var(--text-muted)]">
                      Доходность (%)
                    </div>
                  ) : null}

                  <div className="flex h-[36px] items-end">
                    <CompactStepperField
                      value={returnValue}
                      readOnly={readOnly}
                      ariaLabelMinus={`Уменьшить ожидаемую доходность категории ${descriptor.label}`}
                      ariaLabelPlus={`Увеличить ожидаемую доходность категории ${descriptor.label}`}
                      onChange={(nextValue) => onChangeReturn(key, nextValue)}
                    />
                  </div>
                </div>

                {!readOnly ? (
                  <div className="flex flex-col">
                    {showLabels ? (
                      <div className="invisible mb-[10px] whitespace-nowrap text-[11px] leading-[11px]">
                        Удалить
                      </div>
                    ) : null}

                    <div className="flex h-[36px] items-end justify-end">
                      <button
                        type="button"
                        onClick={() => onRemove(key)}
                        className="app-icon-button"
                        aria-label={`Удалить категорию ${descriptor.label}`}
                        title="Удалить"
                        style={{
                          width: 34,
                          height: 34,
                          minWidth: 34,
                          minHeight: 34,
                          borderRadius: 10,
                        }}
                      >
                        <span
                          className="app-icon-button-symbol"
                          style={{ fontSize: 22, lineHeight: "22px" }}
                        >
                          ×
                        </span>
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}

          {!readOnly && availableOptions.length > 0 ? (
            <div className="pb-2">
              <div className="app-field-caption mt-[10px]">
                Добавить категорию:
              </div>

              <div className="mt-[20px] flex flex-wrap gap-2">
                {availableOptions.map((key) => (
                  <button
                    key={key}
                    type="button"
                    className="app-button h-[30px]"
                    onClick={() => onAddCategory(key)}
                  >
                    {getDescriptor(key).label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}