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

  const data = await parseResponse<PlanSettings | null>(response);

  if (!data) {
    return DEFAULT_PLAN_SETTINGS;
  }

  return data;
}

export async function upsertPlanSettings(
  settings: PlanSettings
): Promise<void> {
  const response = await fetch("/api/plan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(settings),
  });

  await parseResponse(response);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(PLAN_UPDATED_EVENT));
  }
}