export type PlanSettings = {
  initialCapital: string;
  monthlyContribution: string;
  inflation: string;
  contributionGrowth: string;
  years: string;

  stocksBondsShare: string;
  stocksBondsReturn: string;

  rubCashShare: string;
  rubCashReturn: string;

  metalsShare: string;
  metalsReturn: string;

  realEstateShare: string;
  realEstateReturn: string;

  currencyShare: string;
  currencyReturn: string;

  otherReturn: string;
};

export const DEFAULT_PLAN_SETTINGS: PlanSettings = {
  initialCapital: "0",
  monthlyContribution: "50000",
  inflation: "9",
  contributionGrowth: "10",
  years: "10",

  stocksBondsShare: "50",
  stocksBondsReturn: "14",

  rubCashShare: "20",
  rubCashReturn: "8",

  metalsShare: "10",
  metalsReturn: "5",

  realEstateShare: "10",
  realEstateReturn: "10",

  currencyShare: "5",
  currencyReturn: "2",

  otherReturn: "0",
};

export const PLAN_STORAGE_KEY = "capital-tracker-plan";
export const PLAN_UPDATED_EVENT = "plan-settings-updated";

export function loadPlanSettings(): PlanSettings {
  if (typeof window === "undefined") {
    return DEFAULT_PLAN_SETTINGS;
  }

  try {
    const raw = window.localStorage.getItem(PLAN_STORAGE_KEY);

    if (!raw) {
      return DEFAULT_PLAN_SETTINGS;
    }

    const parsed = JSON.parse(raw) as Partial<PlanSettings>;

    return {
      ...DEFAULT_PLAN_SETTINGS,
      ...parsed,
    };
  } catch {
    return DEFAULT_PLAN_SETTINGS;
  }
}

export function savePlanSettings(settings: PlanSettings) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent(PLAN_UPDATED_EVENT));
  } catch {
    // ignore
  }
}

export function getPlanAllocation(settings: PlanSettings) {
  const stocksBondsShare = Number(settings.stocksBondsShare) || 0;
  const rubCashShare = Number(settings.rubCashShare) || 0;
  const metalsShare = Number(settings.metalsShare) || 0;
  const realEstateShare = Number(settings.realEstateShare) || 0;
  const currencyShare = Number(settings.currencyShare) || 0;

  const totalManualShare =
    stocksBondsShare +
    rubCashShare +
    metalsShare +
    realEstateShare +
    currencyShare;

  const otherShare = Math.max(0, 100 - totalManualShare);

  return [
    { category: "Акции/облигации", planPercent: stocksBondsShare },
    { category: "Кэш в рублях", planPercent: rubCashShare },
    { category: "Драгметаллы", planPercent: metalsShare },
    { category: "Недвижимость", planPercent: realEstateShare },
    { category: "Валюта", planPercent: currencyShare },
    { category: "Прочее", planPercent: otherShare },
  ];
}