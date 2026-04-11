export const PLAN_UPDATED_EVENT = "capital-plan-updated";

export type PlanSettings = {
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

  bondsShare: string;
  bondsReturn: string;

  depositsShare: string;
  depositsReturn: string;

  cryptoShare: string;
  cryptoReturn: string;

  otherShare: string;
  otherReturn: string;

  planStartDate: string;
};

export const DEFAULT_PLAN_SETTINGS: PlanSettings = {
  monthlyContribution: "50000",
  inflation: "9",
  contributionGrowth: "10",
  years: "10",

  stocksBondsShare: "50",
  stocksBondsReturn: "14",

  rubCashShare: "20",
  rubCashReturn: "10",

  metalsShare: "10",
  metalsReturn: "8",

  realEstateShare: "10",
  realEstateReturn: "10",

  currencyShare: "5",
  currencyReturn: "5",

  bondsShare: "0",
  bondsReturn: "11",

  depositsShare: "0",
  depositsReturn: "12",

  cryptoShare: "0",
  cryptoReturn: "0",

  otherShare: "0",
  otherReturn: "0",

  planStartDate: "",
};

export function formatLocalDateForInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function createDefaultPlanSettings(): PlanSettings {
  return {
    ...DEFAULT_PLAN_SETTINGS,
    planStartDate: formatLocalDateForInput(new Date()),
  };
}

function toSafeInt(value: unknown) {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return 0;
  return Math.max(0, Math.round(parsed));
}

function normalizePlanShares(settings: PlanSettings): PlanSettings {
  const stocks = toSafeInt(settings.stocksBondsShare);
  const cash = toSafeInt(settings.rubCashShare);
  const metals = toSafeInt(settings.metalsShare);
  const realEstate = toSafeInt(settings.realEstateShare);
  const currency = toSafeInt(settings.currencyShare);
  const bonds = toSafeInt(settings.bondsShare);
  const deposits = toSafeInt(settings.depositsShare);
  const crypto = toSafeInt(settings.cryptoShare);
  const other = toSafeInt(settings.otherShare);

  const total =
    stocks +
    cash +
    metals +
    realEstate +
    currency +
    bonds +
    deposits +
    crypto +
    other;

  if (total === 100) {
    return {
      ...settings,
      stocksBondsShare: String(stocks),
      rubCashShare: String(cash),
      metalsShare: String(metals),
      realEstateShare: String(realEstate),
      currencyShare: String(currency),
      bondsShare: String(bonds),
      depositsShare: String(deposits),
      cryptoShare: String(crypto),
      otherShare: String(other),
    };
  }

  const normalizedCash = Math.max(0, cash + (100 - total));

  return {
    ...settings,
    stocksBondsShare: String(stocks),
    rubCashShare: String(normalizedCash),
    metalsShare: String(metals),
    realEstateShare: String(realEstate),
    currencyShare: String(currency),
    bondsShare: String(bonds),
    depositsShare: String(deposits),
    cryptoShare: String(crypto),
    otherShare: String(other),
  };
}

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || "Ошибка запроса");
  }

  return data;
}

export async function fetchPlanSettings(): Promise<PlanSettings> {
  const response = await fetch("/api/plan", {
    method: "GET",
    cache: "no-store",
  });

  const data = await parseResponse<Partial<PlanSettings> | null>(response);
  const defaults = createDefaultPlanSettings();

  if (!data) {
    return defaults;
  }

  const merged: PlanSettings = {
    ...defaults,
    ...data,
    planStartDate: data.planStartDate || defaults.planStartDate,
  };

  return normalizePlanShares(merged);
}

export async function upsertPlanSettings(
  settings: PlanSettings
): Promise<void> {
  const normalizedSettings = normalizePlanShares(settings);

  const response = await fetch("/api/plan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(normalizedSettings),
  });

  await parseResponse(response);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(PLAN_UPDATED_EVENT));
  }
}