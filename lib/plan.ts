export const PLAN_STORAGE_KEY = "capital_plan_settings";
export const PLAN_UPDATED_EVENT = "capital-plan-updated";

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

function normalizePlanSettings(
  value: Partial<PlanSettings> | null | undefined
): PlanSettings {
  return {
    initialCapital: value?.initialCapital ?? DEFAULT_PLAN_SETTINGS.initialCapital,
    monthlyContribution:
      value?.monthlyContribution ?? DEFAULT_PLAN_SETTINGS.monthlyContribution,
    inflation: value?.inflation ?? DEFAULT_PLAN_SETTINGS.inflation,
    contributionGrowth:
      value?.contributionGrowth ?? DEFAULT_PLAN_SETTINGS.contributionGrowth,
    years: value?.years ?? DEFAULT_PLAN_SETTINGS.years,

    stocksBondsShare:
      value?.stocksBondsShare ?? DEFAULT_PLAN_SETTINGS.stocksBondsShare,
    stocksBondsReturn:
      value?.stocksBondsReturn ?? DEFAULT_PLAN_SETTINGS.stocksBondsReturn,

    rubCashShare: value?.rubCashShare ?? DEFAULT_PLAN_SETTINGS.rubCashShare,
    rubCashReturn: value?.rubCashReturn ?? DEFAULT_PLAN_SETTINGS.rubCashReturn,

    metalsShare: value?.metalsShare ?? DEFAULT_PLAN_SETTINGS.metalsShare,
    metalsReturn: value?.metalsReturn ?? DEFAULT_PLAN_SETTINGS.metalsReturn,

    realEstateShare:
      value?.realEstateShare ?? DEFAULT_PLAN_SETTINGS.realEstateShare,
    realEstateReturn:
      value?.realEstateReturn ?? DEFAULT_PLAN_SETTINGS.realEstateReturn,

    currencyShare: value?.currencyShare ?? DEFAULT_PLAN_SETTINGS.currencyShare,
    currencyReturn:
      value?.currencyReturn ?? DEFAULT_PLAN_SETTINGS.currencyReturn,

    otherReturn: value?.otherReturn ?? DEFAULT_PLAN_SETTINGS.otherReturn,
  };
}

export function loadPlanSettings(): PlanSettings {
  if (typeof window === "undefined") {
    return DEFAULT_PLAN_SETTINGS;
  }

  const raw = localStorage.getItem(PLAN_STORAGE_KEY);
  if (!raw) return DEFAULT_PLAN_SETTINGS;

  try {
    const parsed = JSON.parse(raw) as Partial<PlanSettings>;
    return normalizePlanSettings(parsed);
  } catch {
    return DEFAULT_PLAN_SETTINGS;
  }
}

export function savePlanSettings(settings: PlanSettings) {
  if (typeof window === "undefined") return;

  const normalized = normalizePlanSettings(settings);
  localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(normalized));
  window.dispatchEvent(new Event(PLAN_UPDATED_EVENT));
}

export async function fetchPlanSettings(): Promise<PlanSettings> {
  return loadPlanSettings();
}

export async function upsertPlanSettings(settings: PlanSettings) {
  savePlanSettings(settings);
}

export function getPlanAllocation(settings: PlanSettings) {
  const items = [
    {
      category: "Акции/облигации",
      planPercent: Number(settings.stocksBondsShare) || 0,
    },
    {
      category: "Кэш в рублях",
      planPercent: Number(settings.rubCashShare) || 0,
    },
    {
      category: "Драгметаллы",
      planPercent: Number(settings.metalsShare) || 0,
    },
    {
      category: "Недвижимость",
      planPercent: Number(settings.realEstateShare) || 0,
    },
    {
      category: "Валюта",
      planPercent: Number(settings.currencyShare) || 0,
    },
  ];

  const manualTotal = items.reduce((sum, item) => sum + item.planPercent, 0);
  const otherPercent = Math.max(0, 100 - manualTotal);

  return [
    ...items,
    {
      category: "Прочее",
      planPercent: otherPercent,
    },
  ];
}