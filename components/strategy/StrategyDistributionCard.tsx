import type { PlanSettings } from "@/lib/plan";
import { BALANCED_PRESET, type DistributionMode } from "@/lib/strategy";

type StrategyDistributionCardProps = {
  plan: PlanSettings;
  distributionMode: DistributionMode;
  setDistributionMode: (mode: DistributionMode) => void;
  onChangePlan: (next: PlanSettings) => void;
};

type InputProps = {
  label: string;
  hint: string;
  value: string;
  onChange: (value: string) => void;
};

export default function StrategyDistributionCard({
  plan,
  distributionMode,
  setDistributionMode,
  onChangePlan,
}: StrategyDistributionCardProps) {
  return (
    <section className="app-card">
      <div className="space-y-4">
        <div className="app-card-title">Способ распределения капитала</div>

        <div className="grid gap-3 md:grid-cols-3">
          <ModeCard
            title="Только Cash"
            description="Простой режим без сложной структуры"
            isActive={distributionMode === "cash"}
            onClick={() => {
              setDistributionMode("cash");
              onChangePlan({
                ...plan,
                rubCashShare: "100",
                stocksBondsShare: "0",
                metalsShare: "0",
                realEstateShare: "0",
                currencyShare: "0",
              });
            }}
          />

          <ModeCard
            title="Баланс"
            description="Cash, акции и металлы"
            isActive={distributionMode === "balanced"}
            onClick={() => {
              setDistributionMode("balanced");
              onChangePlan({
                ...plan,
                ...BALANCED_PRESET,
              });
            }}
          />

          <ModeCard
            title="Настроить самому"
            description="Ручная настройка"
            isActive={distributionMode === "manual"}
            onClick={() => setDistributionMode("manual")}
          />
        </div>

        {distributionMode === "manual" && (
          <div className="grid gap-4 md:grid-cols-2 pt-2">
            <div className="space-y-3">
              <Input
                label="Cash (%)"
                hint="Доля в портфеле"
                value={plan.rubCashShare}
                onChange={(value) =>
                  onChangePlan({ ...plan, rubCashShare: value })
                }
              />

              <Input
                label="Акции (%)"
                hint="Доля в портфеле"
                value={plan.stocksBondsShare}
                onChange={(value) =>
                  onChangePlan({ ...plan, stocksBondsShare: value })
                }
              />

              <Input
                label="Металлы (%)"
                hint="Доля в портфеле"
                value={plan.metalsShare}
                onChange={(value) =>
                  onChangePlan({ ...plan, metalsShare: value })
                }
              />

              <Input
                label="Недвижимость (%)"
                hint="Доля в портфеле"
                value={plan.realEstateShare}
                onChange={(value) =>
                  onChangePlan({ ...plan, realEstateShare: value })
                }
              />

              <Input
                label="Валюта (%)"
                hint="Доля в портфеле"
                value={plan.currencyShare}
                onChange={(value) =>
                  onChangePlan({ ...plan, currencyShare: value })
                }
              />
            </div>

            <div className="space-y-3">
              <Input
                label="Cash доходность (%)"
                hint="Ожидаемая доходность"
                value={plan.rubCashReturn}
                onChange={(value) =>
                  onChangePlan({ ...plan, rubCashReturn: value })
                }
              />

              <Input
                label="Акции доходность (%)"
                hint="Ожидаемая доходность"
                value={plan.stocksBondsReturn}
                onChange={(value) =>
                  onChangePlan({ ...plan, stocksBondsReturn: value })
                }
              />

              <Input
                label="Металлы доходность (%)"
                hint="Ожидаемая доходность"
                value={plan.metalsReturn}
                onChange={(value) =>
                  onChangePlan({ ...plan, metalsReturn: value })
                }
              />

              <Input
                label="Недвижимость доходность (%)"
                hint="Ожидаемая доходность"
                value={plan.realEstateReturn}
                onChange={(value) =>
                  onChangePlan({ ...plan, realEstateReturn: value })
                }
              />

              <Input
                label="Валюта доходность (%)"
                hint="Ожидаемая доходность"
                value={plan.currencyReturn}
                onChange={(value) =>
                  onChangePlan({ ...plan, currencyReturn: value })
                }
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function ModeCard({
  title,
  description,
  isActive,
  onClick,
}: {
  title: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left rounded-[18px] border p-4 transition"
      style={{
        borderColor: isActive ? "#22c55e" : "var(--border)",
        background: "var(--card)",
      }}
    >
      <div className="space-y-2">
        <div className="text-[16px] font-semibold">{title}</div>
        <div className="app-text-small">{description}</div>
      </div>
    </button>
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