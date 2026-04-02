import type { PlanSettings } from "@/lib/plan";

type StrategyPlanFormProps = {
  plan: PlanSettings;
  onChangePlan: (next: PlanSettings) => void;
  saveStatusText: string;
  saveStatusColor: string;
};

type InputProps = {
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
    <section className="app-card space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="app-card-title">План твоих накоплений</div>

        <div
          className="text-[13px] font-medium whitespace-nowrap"
          style={{ color: saveStatusColor }}
        >
          {saveStatusText}
        </div>
      </div>

      <Input
        label="Ежемесячный взнос"
        hint="Сколько будешь откладывать"
        value={plan.monthlyContribution}
        onChange={(value) =>
          onChangePlan({ ...plan, monthlyContribution: value })
        }
      />

      <Input
        label="Рост взноса (%)"
        hint="Ежегодно"
        value={plan.contributionGrowth}
        onChange={(value) =>
          onChangePlan({ ...plan, contributionGrowth: value })
        }
      />

      <Input
        label="Инфляция (%)"
        hint="8–10%"
        value={plan.inflation}
        onChange={(value) => onChangePlan({ ...plan, inflation: value })}
      />

      <Input
        label="Срок (лет)"
        hint="Горизонт"
        value={plan.years}
        onChange={(value) => onChangePlan({ ...plan, years: value })}
      />

      <DateInput
        label="Дата начала"
        hint="Старт"
        value={plan.planStartDate}
        onChange={(value) => onChangePlan({ ...plan, planStartDate: value })}
      />
    </section>
  );
}

function Input({ label, hint, value, onChange }: InputProps) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between gap-3">
        <label className="app-label">{label}</label>
        <span className="app-text-small text-right">{hint}</span>
      </div>

      <input
        className="app-input"
        value={value}
        onFocus={(e) => e.target.select()}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function DateInput({ label, hint, value, onChange }: InputProps) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between gap-3">
        <label className="app-label">{label}</label>
        <span className="app-text-small text-right">{hint}</span>
      </div>

      <input
        type="date"
        className="app-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}