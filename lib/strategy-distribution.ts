import type { PlanSettings } from "@/lib/plan";

export type ManualCategoryKey =
  | "cash"
  | "stocks"
  | "bonds"
  | "currency"
  | "metals"
  | "realEstate"
  | "deposits"
  | "crypto"
  | "other";

export type ManualCategoryDescriptor = {
  key: ManualCategoryKey;
  label: string;
  getShare: (plan: PlanSettings) => string;
  setShare: (plan: PlanSettings, value: string) => PlanSettings;
  getReturn: (plan: PlanSettings) => string;
  setReturn: (plan: PlanSettings, value: string) => PlanSettings;
};

export const DEFAULT_CATEGORY_RETURNS: Record<ManualCategoryKey, string> = {
  cash: "10",
  stocks: "14",
  bonds: "11",
  currency: "5",
  metals: "8",
  realEstate: "10",
  deposits: "12",
  crypto: "0",
  other: "0",
};

export const CATEGORY_DESCRIPTORS: ManualCategoryDescriptor[] = [
  {
    key: "cash",
    label: "Cash",
    getShare: (plan) => plan.rubCashShare,
    setShare: (plan, value) => ({ ...plan, rubCashShare: value }),
    getReturn: (plan) => plan.rubCashReturn,
    setReturn: (plan, value) => ({ ...plan, rubCashReturn: value }),
  },
  {
    key: "stocks",
    label: "Акции",
    getShare: (plan) => plan.stocksBondsShare,
    setShare: (plan, value) => ({ ...plan, stocksBondsShare: value }),
    getReturn: (plan) => plan.stocksBondsReturn,
    setReturn: (plan, value) => ({ ...plan, stocksBondsReturn: value }),
  },
  {
    key: "bonds",
    label: "Облигации",
    getShare: (plan) => plan.bondsShare,
    setShare: (plan, value) => ({ ...plan, bondsShare: value }),
    getReturn: (plan) => plan.bondsReturn,
    setReturn: (plan, value) => ({ ...plan, bondsReturn: value }),
  },
  {
    key: "currency",
    label: "Валюта",
    getShare: (plan) => plan.currencyShare,
    setShare: (plan, value) => ({ ...plan, currencyShare: value }),
    getReturn: (plan) => plan.currencyReturn,
    setReturn: (plan, value) => ({ ...plan, currencyReturn: value }),
  },
  {
    key: "metals",
    label: "Металлы",
    getShare: (plan) => plan.metalsShare,
    setShare: (plan, value) => ({ ...plan, metalsShare: value }),
    getReturn: (plan) => plan.metalsReturn,
    setReturn: (plan, value) => ({ ...plan, metalsReturn: value }),
  },
  {
    key: "realEstate",
    label: "Недвижимость",
    getShare: (plan) => plan.realEstateShare,
    setShare: (plan, value) => ({ ...plan, realEstateShare: value }),
    getReturn: (plan) => plan.realEstateReturn,
    setReturn: (plan, value) => ({ ...plan, realEstateReturn: value }),
  },
  {
    key: "deposits",
    label: "Депозиты",
    getShare: (plan) => plan.depositsShare,
    setShare: (plan, value) => ({ ...plan, depositsShare: value }),
    getReturn: (plan) => plan.depositsReturn,
    setReturn: (plan, value) => ({ ...plan, depositsReturn: value }),
  },
  {
    key: "crypto",
    label: "Крипта",
    getShare: (plan) => plan.cryptoShare,
    setShare: (plan, value) => ({ ...plan, cryptoShare: value }),
    getReturn: (plan) => plan.cryptoReturn,
    setReturn: (plan, value) => ({ ...plan, cryptoReturn: value }),
  },
  {
    key: "other",
    label: "Прочее",
    getShare: (plan) => plan.otherShare,
    setShare: (plan, value) => ({ ...plan, otherShare: value }),
    getReturn: (plan) => plan.otherReturn,
    setReturn: (plan, value) => ({ ...plan, otherReturn: value }),
  },
];

export const NON_CASH_KEYS: ManualCategoryKey[] = [
  "stocks",
  "bonds",
  "currency",
  "metals",
  "realEstate",
  "deposits",
  "crypto",
  "other",
];

export function getDescriptor(key: ManualCategoryKey) {
  return CATEGORY_DESCRIPTORS.find((item) => item.key === key)!;
}

export function toInt(value: string) {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return 0;
  return Math.max(0, Math.round(parsed));
}