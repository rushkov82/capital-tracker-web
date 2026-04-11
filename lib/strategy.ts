import type { PlanSettings } from "@/lib/plan";

export type DistributionMode = "cash" | "balanced" | "active" | "manual";

export const BALANCED_PRESET = {
  rubCashShare: "40",
  stocksBondsShare: "40",
  bondsShare: "0",
  currencyShare: "0",
  metalsShare: "20",
  realEstateShare: "0",
  depositsShare: "0",
  cryptoShare: "0",
  otherShare: "0",
} as const;

export const ACTIVE_PRESET = {
  rubCashShare: "20",
  stocksBondsShare: "60",
  bondsShare: "0",
  currencyShare: "10",
  metalsShare: "10",
  realEstateShare: "0",
  depositsShare: "0",
  cryptoShare: "0",
  otherShare: "0",
} as const;

export function detectDistributionMode(
  plan: PlanSettings
): DistributionMode {
  const cash = Number(plan.rubCashShare || 0);
  const stocks = Number(plan.stocksBondsShare || 0);
  const bonds = Number(plan.bondsShare || 0);
  const currency = Number(plan.currencyShare || 0);
  const metals = Number(plan.metalsShare || 0);
  const realEstate = Number(plan.realEstateShare || 0);
  const deposits = Number(plan.depositsShare || 0);
  const crypto = Number(plan.cryptoShare || 0);
  const other = Number(plan.otherShare || 0);

  if (
    cash === 100 &&
    stocks === 0 &&
    bonds === 0 &&
    currency === 0 &&
    metals === 0 &&
    realEstate === 0 &&
    deposits === 0 &&
    crypto === 0 &&
    other === 0
  ) {
    return "cash";
  }

  if (
    cash === Number(BALANCED_PRESET.rubCashShare) &&
    stocks === Number(BALANCED_PRESET.stocksBondsShare) &&
    bonds === Number(BALANCED_PRESET.bondsShare) &&
    currency === Number(BALANCED_PRESET.currencyShare) &&
    metals === Number(BALANCED_PRESET.metalsShare) &&
    realEstate === Number(BALANCED_PRESET.realEstateShare) &&
    deposits === Number(BALANCED_PRESET.depositsShare) &&
    crypto === Number(BALANCED_PRESET.cryptoShare) &&
    other === Number(BALANCED_PRESET.otherShare)
  ) {
    return "balanced";
  }

  if (
    cash === Number(ACTIVE_PRESET.rubCashShare) &&
    stocks === Number(ACTIVE_PRESET.stocksBondsShare) &&
    bonds === Number(ACTIVE_PRESET.bondsShare) &&
    currency === Number(ACTIVE_PRESET.currencyShare) &&
    metals === Number(ACTIVE_PRESET.metalsShare) &&
    realEstate === Number(ACTIVE_PRESET.realEstateShare) &&
    deposits === Number(ACTIVE_PRESET.depositsShare) &&
    crypto === Number(ACTIVE_PRESET.cryptoShare) &&
    other === Number(ACTIVE_PRESET.otherShare)
  ) {
    return "active";
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
    { label: "Облигации", share: Number(plan.bondsShare || 0) },
    { label: "Валюта", share: Number(plan.currencyShare || 0) },
    { label: "Металлы", share: Number(plan.metalsShare || 0) },
    { label: "Недвижимость", share: Number(plan.realEstateShare || 0) },
    { label: "Депозиты", share: Number(plan.depositsShare || 0) },
    { label: "Крипта", share: Number(plan.cryptoShare || 0) },
    { label: "Прочее", share: Number(plan.otherShare || 0) },
  ];

  return items.filter((item) => item.share > 0);
}