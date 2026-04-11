"use client";

import type { PlanSettings } from "@/lib/plan";
import CardHeader from "@/components/ui/CardHeader";

type StrategyPlanFormProps = {
  plan: PlanSettings;
  onChangePlan: (next: PlanSettings) => void;
  saveStatusText: string;
  saveStatusColor: string;
};

type NumberInputProps = {
  label: string;
  hint: string;
  value: string;
  onChange: (value: string) => void;
  mode?: "currency" | "percent" | "years";
};

type DateInputProps = {
  label: string;
  hint: string;
  value: string;
  onChange: (value: string) => void;
};

export default function StrategyPlanForm({
  plan,
  onChangePlan,
  saveStatusText,
  saveStatusColor,
}: StrategyPlanFormProps) {
  return (
    <section className="app-card min-w-0">
      <div className="app-card-stack">
        <CardHeader
          title="План твоих накоплений"
          rightSlot={
            <div
              className="text-[13px] leading-[18px] font-medium whitespace-nowrap"
              style={{ color: saveStatusColor }}
            >
              {saveStatusText}
            </div>
          }
        />

        <div className="flex flex-col gap-4 lg:gap-6">
          <NumberInput
            label="Твой ежемесячный взнос"
            hint="Сколько будешь откладывать"
            value={plan.monthlyContribution}
            mode="currency"
            onChange={(value) =>
              onChangePlan({ ...plan, monthlyContribution: value })
            }
          />

          <NumberInput
            label="Ежегодное увеличение взноса (%)"
            hint="Если доход растёт — увеличивай"
            value={plan.contributionGrowth}
            mode="percent"
            onChange={(value) =>
              onChangePlan({ ...plan, contributionGrowth: value })
            }
          />

          <NumberInput
            label="Ожидаемая годовая инфляция (%)"
            hint="Можно оставить 7–9%"
            value={plan.inflation}
            mode="percent"
            onChange={(value) => onChangePlan({ ...plan, inflation: value })}
          />

          <NumberInput
            label="Срок накопления (лет)"
            hint="На сколько лет планируешь"
            value={plan.years}
            mode="years"
            onChange={(value) => onChangePlan({ ...plan, years: value })}
          />

          <DateInput
            label="Дата начала накопления"
            hint="С какого момента считаем план"
            value={plan.planStartDate}
            onChange={(value) =>
              onChangePlan({ ...plan, planStartDate: value })
            }
          />
        </div>
      </div>
    </section>
  );
}

function NumberInput({
  label,
  hint,
  value,
  onChange,
  mode = "currency",
}: NumberInputProps) {
  const numericValue = parseDigits(value);
  const displayValue =
    mode === "currency" ? formatThousands(value) : String(numericValue);

  function handleChange(raw: string) {
    const next = sanitizeValue(raw, mode);
    onChange(next);
  }

  function handleStep(delta: number) {
    const stepped = stepValue(value, mode, delta);
    onChange(stepped);
  }

  const isMinusDisabled = numericValue <= 0;
  const isPlusDisabled =
    (mode === "percent" || mode === "years") && numericValue >= 100;

  return (
    <div className="app-field">
      <div className="flex flex-col gap-1 lg:grid lg:grid-cols-[minmax(0,1fr)_200px] lg:items-center lg:gap-x-4">
        <div className="min-w-0">
          <label className="app-form-label block leading-[1.2] whitespace-nowrap lg:text-[13px] lg:leading-[16px]">
            {label}
          </label>

          <span className="block text-left text-[12px] leading-[16px] text-[var(--text-muted)] whitespace-nowrap">
            {hint}
          </span>
        </div>

        <div className="relative lg:w-[200px]">
          <input
            inputMode="numeric"
            className="h-[34px] w-full rounded-[10px] border border-[var(--border)] bg-transparent pl-[16px] pr-[64px] text-left text-[13px] leading-[34px] text-[var(--text-primary)] outline-none appearance-none lg:w-[200px]"
            value={displayValue}
            onFocus={(e) => e.target.select()}
            onChange={(e) => handleChange(e.target.value)}
          />

          <div className="absolute right-[36px] top-1/2 h-[18px] w-px -translate-y-1/2 bg-[var(--border)] opacity-60" />

          <button
            type="button"
            className="absolute right-[28px] top-0 flex h-[34px] w-[28px] items-center justify-center bg-transparent text-[16px] font-semibold leading-none text-[var(--text-secondary)] transition hover:bg-[rgba(148,163,184,0.08)] disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => handleStep(-1)}
            disabled={isMinusDisabled}
            aria-label={`Уменьшить значение поля ${label}`}
            title="Уменьшить"
          >
            −
          </button>

          <button
            type="button"
            className="absolute right-0 top-0 flex h-[34px] w-[28px] items-center justify-center rounded-r-[10px] bg-transparent text-[16px] font-semibold leading-none text-[var(--text-secondary)] transition hover:bg-[rgba(148,163,184,0.08)] disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => handleStep(1)}
            disabled={isPlusDisabled}
            aria-label={`Увеличить значение поля ${label}`}
            title="Увеличить"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

function DateInput({ label, hint, value, onChange }: DateInputProps) {
  return (
    <div className="app-field">
      <div className="flex flex-col gap-1 lg:grid lg:grid-cols-[minmax(0,1fr)_200px] lg:items-center lg:gap-x-4">
        <div className="min-w-0">
          <label className="app-form-label block leading-[1.2] whitespace-nowrap lg:text-[13px] lg:leading-[16px]">
            {label}
          </label>

          <span className="block text-left text-[12px] leading-[16px] text-[var(--text-muted)] whitespace-nowrap">
            {hint}
          </span>
        </div>

        <input
          type="date"
          className="h-[34px] w-full rounded-[10px] border border-[var(--border)] bg-transparent px-[16px] text-[13px] leading-[34px] text-[var(--text-primary)] outline-none appearance-none lg:w-[200px]"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}

function parseDigits(value: string): number {
  const digits = value.replace(/\D/g, "");
  if (!digits) return 0;
  return Number(digits);
}

function formatThousands(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString("ru-RU");
}

function sanitizeValue(
  raw: string,
  mode: "currency" | "percent" | "years"
): string {
  const digits = raw.replace(/\D/g, "");

  if (!digits) return "";

  const numeric = Number(digits);

  if (mode === "currency") {
    return String(numeric);
  }

  return String(Math.min(numeric, 100));
}

function stepValue(
  current: string,
  mode: "currency" | "percent" | "years",
  delta: number
): string {
  const numeric = parseDigits(current);

  if (mode === "currency") {
    const baseStep = getCurrencyStep(numeric);
    const next = Math.max(0, numeric + delta * baseStep);
    return next === 0 ? "" : String(next);
  }

  const next = Math.max(0, Math.min(100, numeric + delta));
  return next === 0 ? "" : String(next);
}

function getCurrencyStep(value: number): number {
  if (value >= 1_000_000) return 100_000;
  if (value >= 100_000) return 10_000;
  if (value >= 10_000) return 1_000;
  return 100;
}