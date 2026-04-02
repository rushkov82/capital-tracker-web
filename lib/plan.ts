export const PLAN_STORAGE_KEY = "capital_plan_settings";
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
  rubCashReturn: "8",

  metalsShare: "10",
  metalsReturn: "5",

  realEstateShare: "10",
  realEstateReturn: "10",

  currencyShare: "5",
  currencyReturn: "2",

  otherReturn: "0",
  planStartDate: new Date().toISOString().slice(0, 10),
};

function isLocalMode() {
  if (typeof window === "undefined") return false;

  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1";
}

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || "Ошибка запроса");
  }

  return data;
}

function readLocalPlan(): PlanSettings {
  if (typeof window === "undefined") {
    return DEFAULT_PLAN_SETTINGS;
  }

  const raw = window.localStorage.getItem(PLAN_STORAGE_KEY);

  if (!raw) {
    return DEFAULT_PLAN_SETTINGS;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<PlanSettings>;

    return {
      ...DEFAULT_PLAN_SETTINGS,
      ...parsed,
      planStartDate:
        parsed.planStartDate || DEFAULT_PLAN_SETTINGS.planStartDate,
    };
  } catch {
    return DEFAULT_PLAN_SETTINGS;
  }
}

function writeLocalPlan(settings: PlanSettings) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(settings));
  window.dispatchEvent(new Event(PLAN_UPDATED_EVENT));
}

export async function fetchPlanSettings(): Promise<PlanSettings> {
  if (isLocalMode()) {
    return readLocalPlan();
  }

  const response = await fetch("/api/plan", {
    method: "GET",
    cache: "no-store",
  });

  const data = await parseResponse<PlanSettings | null>(response);

  if (!data) {
    return DEFAULT_PLAN_SETTINGS;
  }

  return {
    ...DEFAULT_PLAN_SETTINGS,
    ...data,
    planStartDate: data.planStartDate || DEFAULT_PLAN_SETTINGS.planStartDate,
  };
}

export async function upsertPlanSettings(
  settings: PlanSettings
): Promise<void> {
  if (isLocalMode()) {
    writeLocalPlan(settings);
    return;
  }

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