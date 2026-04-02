import type { PlanSettings } from "@/lib/plan";

export type DistributionMode = "cash" | "balanced" | "manual";

export const BALANCED_PRESET = {
  rubCashShare: "40",
  stocksBondsShare: "40",
  metalsShare: "20",
  realEstateShare: "0",
  currencyShare: "0",
} as const;

export function detectDistributionMode(
  plan: PlanSettings
): DistributionMode {
  const cash = Number(plan.rubCashShare || 0);
  const stocks = Number(plan.stocksBondsShare || 0);
  const metals = Number(plan.metalsShare || 0);
  const realEstate = Number(plan.realEstateShare || 0);
  const currency = Number(plan.currencyShare || 0);

  if (
    cash === 100 &&
    stocks === 0 &&
    metals === 0 &&
    realEstate === 0 &&
    currency === 0
  ) {
    return "cash";
  }

  if (
    cash === Number(BALANCED_PRESET.rubCashShare) &&
    stocks === Number(BALANCED_PRESET.stocksBondsShare) &&
    metals === Number(BALANCED_PRESET.metalsShare) &&
    realEstate === Number(BALANCED_PRESET.realEstateShare) &&
    currency === Number(BALANCED_PRESET.currencyShare)
  ) {
    return "balanced";
  }

  return "manual";
}

export function getYearsWord(years: number) {
  if (years % 10 === 1 && years % 100 !== 11) return "год";
  if (
    [2, 3, 4].includes(years % 10) &&
    ![12, 13, 14].includes(years % 100)
  ) {
    return "года";
  }
  return "лет";
}

export function buildCompositionItems(plan: PlanSettings) {
  const items = [
    { label: "Cash", share: Number(plan.rubCashShare || 0) },
    { label: "Акции", share: Number(plan.stocksBondsShare || 0) },
    { label: "Металлы", share: Number(plan.metalsShare || 0) },
    { label: "Недвижимость", share: Number(plan.realEstateShare || 0) },
    { label: "Валюта", share: Number(plan.currencyShare || 0) },
  ];

  return items.filter((item) => item.share > 0);
}