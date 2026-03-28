import { createClient } from "@/lib/supabase/client";

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

async function getCurrentUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function fetchPlanSettings(): Promise<PlanSettings> {
  const user = await getCurrentUser();

  if (!user) {
    return loadPlanSettings();
  }

  const supabase = createClient();

  const { data, error } = await supabase
    .from("plan_settings")
    .select(
      `
      initial_capital,
      monthly_contribution,
      inflation,
      contribution_growth,
      years,
      stocks_bonds_share,
      stocks_bonds_return,
      rub_cash_share,
      rub_cash_return,
      metals_share,
      metals_return,
      real_estate_share,
      real_estate_return,
      currency_share,
      currency_return,
      other_return
    `
    )
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    const fallback = loadPlanSettings();
    return fallback;
  }

  const mapped = normalizePlanSettings({
    initialCapital: data.initial_capital,
    monthlyContribution: data.monthly_contribution,
    inflation: data.inflation,
    contributionGrowth: data.contribution_growth,
    years: data.years,

    stocksBondsShare: data.stocks_bonds_share,
    stocksBondsReturn: data.stocks_bonds_return,

    rubCashShare: data.rub_cash_share,
    rubCashReturn: data.rub_cash_return,

    metalsShare: data.metals_share,
    metalsReturn: data.metals_return,

    realEstateShare: data.real_estate_share,
    realEstateReturn: data.real_estate_return,

    currencyShare: data.currency_share,
    currencyReturn: data.currency_return,

    otherReturn: data.other_return,
  });

  savePlanSettings(mapped);
  return mapped;
}

export async function upsertPlanSettings(settings: PlanSettings) {
  const normalized = normalizePlanSettings(settings);
  savePlanSettings(normalized);

  const user = await getCurrentUser();
  if (!user) return;

  const supabase = createClient();

  const { error } = await supabase.from("plan_settings").upsert(
    {
      user_id: user.id,

      initial_capital: normalized.initialCapital,
      monthly_contribution: normalized.monthlyContribution,
      inflation: normalized.inflation,
      contribution_growth: normalized.contributionGrowth,
      years: normalized.years,

      stocks_bonds_share: normalized.stocksBondsShare,
      stocks_bonds_return: normalized.stocksBondsReturn,

      rub_cash_share: normalized.rubCashShare,
      rub_cash_return: normalized.rubCashReturn,

      metals_share: normalized.metalsShare,
      metals_return: normalized.metalsReturn,

      real_estate_share: normalized.realEstateShare,
      real_estate_return: normalized.realEstateReturn,

      currency_share: normalized.currencyShare,
      currency_return: normalized.currencyReturn,

      other_return: normalized.otherReturn,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) {
    throw new Error(error.message);
  }
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