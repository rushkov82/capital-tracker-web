import { calculateCapital } from "@/lib/calculations";
import type { PlanSettings } from "@/lib/plan";
import type { Operation } from "@/lib/operations";

export type TimeStats = {
  elapsedMonths: number;
  totalMonths: number;
  remainingMonths: number;
  progressPercent: number;
};

type MonthlyNetItem = {
  key: string;
  year: number;
  month: number;
  amount: number;
  isCurrentMonth: boolean;
};

type TempoDirection = "above" | "below" | "equal";

export type CurrentTempoAnalysis = {
  currentMonthlyTempo: number;
  explanationText: string;
};

export function getCurrentMonthFact(operations: Operation[]): number {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  return operations
    .filter((operation) => {
      if (operation.type === "adjustment") return false;

      const date = new Date(operation.operation_date);
      return date.getFullYear() === year && date.getMonth() === month;
    })
    .reduce((sum, operation) => {
      if (operation.type === "expense") return sum - operation.amount;
      return sum + operation.amount;
    }, 0);
}

export function getTimeStats(plan: PlanSettings | null): TimeStats {
  if (!plan) {
    return {
      elapsedMonths: 0,
      totalMonths: 0,
      remainingMonths: 0,
      progressPercent: 0,
    };
  }

  const years = Number(plan.years || 0);
  const totalMonths = years * 12;

  const startDate = new Date(plan.planStartDate);
  const now = new Date();

  const elapsedMonthsRaw =
    (now.getFullYear() - startDate.getFullYear()) * 12 +
    (now.getMonth() - startDate.getMonth());

  const elapsedMonths = Math.max(0, Math.min(totalMonths, elapsedMonthsRaw));
  const remainingMonths = Math.max(0, totalMonths - elapsedMonths);

  const progressPercent =
    totalMonths === 0 ? 0 : Math.round((elapsedMonths / totalMonths) * 100);

  return {
    elapsedMonths,
    totalMonths,
    remainingMonths,
    progressPercent,
  };
}

export function getPlannedNow(args: {
  plan: PlanSettings | null;
  elapsedMonths: number;
}): number {
  const { plan, elapsedMonths } = args;

  if (!plan) return 0;

  const monthlyPlan = Number(plan.monthlyContribution || 0);
  const contributionGrowthRate = Number(plan.contributionGrowth || 0) / 100;

  let total = 0;
  let currentMonthly = monthlyPlan;

  for (let month = 0; month < elapsedMonths; month += 1) {
    total += currentMonthly;

    if ((month + 1) % 12 === 0) {
      currentMonthly *= 1 + contributionGrowthRate;
    }
  }

  return total;
}

function buildMonthlyNetContributions(operations: Operation[]): MonthlyNetItem[] {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const grouped = new Map<string, MonthlyNetItem>();

  for (const operation of operations) {
    if (operation.type === "adjustment") continue;

    const date = new Date(operation.operation_date);
    const year = date.getFullYear();
    const month = date.getMonth();
    const key = `${year}-${String(month + 1).padStart(2, "0")}`;

    const signedAmount =
      operation.type === "expense" ? -operation.amount : operation.amount;

    const existing = grouped.get(key);

    if (existing) {
      existing.amount += signedAmount;
      continue;
    }

    grouped.set(key, {
      key,
      year,
      month,
      amount: signedAmount,
      isCurrentMonth: year === currentYear && month === currentMonth,
    });
  }

  return Array.from(grouped.values()).sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.month - b.month;
  });
}

function detectTempoDirection(
  tempo: number,
  monthlyPlan: number
): TempoDirection {
  const tolerance = Math.max(monthlyPlan * 0.01, 1);
  const diff = tempo - monthlyPlan;

  if (diff > tolerance) return "above";
  if (diff < -tolerance) return "below";
  return "equal";
}

function buildTempoExplanationText(args: {
  sampleMonthsCount: number;
  isCurrentMonthOnly: boolean;
  direction: TempoDirection;
}): string {
  const { sampleMonthsCount, isCurrentMonthOnly, direction } = args;

  if (isCurrentMonthOnly) {
    return "Пока прогноз основан на данных за текущий неполный месяц и ещё может заметно измениться.";
  }

  const monthWord =
    sampleMonthsCount === 1
      ? "1 полном месяце"
      : `${sampleMonthsCount} полных месяцах`;

  const directionText =
    direction === "above"
      ? "Темп был выше плана"
      : direction === "below"
      ? "Темп был ниже плана"
      : "Темп был на уровне плана";

  if (sampleMonthsCount === 1) {
    return `Пока прогноз основан на ${monthWord}. ${directionText}.`;
  }

  return `За последние ${monthWord} ${directionText.toLowerCase()}.`;
}

export function getCurrentTempoAnalysis(args: {
  operations: Operation[];
  monthlyPlan: number;
}): CurrentTempoAnalysis {
  const { operations, monthlyPlan } = args;
  const monthlyItems = buildMonthlyNetContributions(operations);

  const fullMonths = monthlyItems.filter((item) => !item.isCurrentMonth);
  const recentFullMonths = fullMonths.slice(-3);

  if (recentFullMonths.length > 0) {
    const total = recentFullMonths.reduce((sum, item) => sum + item.amount, 0);
    const currentMonthlyTempo = Math.max(0, total / recentFullMonths.length);
    const direction = detectTempoDirection(currentMonthlyTempo, monthlyPlan);

    return {
      currentMonthlyTempo,
      explanationText: buildTempoExplanationText({
        sampleMonthsCount: recentFullMonths.length,
        isCurrentMonthOnly: false,
        direction,
      }),
    };
  }

  const currentMonth = monthlyItems.find((item) => item.isCurrentMonth);
  if (currentMonth) {
    return {
      currentMonthlyTempo: Math.max(0, currentMonth.amount),
      explanationText: buildTempoExplanationText({
        sampleMonthsCount: 0,
        isCurrentMonthOnly: true,
        direction: "equal",
      }),
    };
  }

  return {
    currentMonthlyTempo: 0,
    explanationText:
      "Пока недостаточно данных для устойчивого прогноза накоплений.",
  };
}

export function getForecastAmounts(args: {
  plan: PlanSettings | null;
  currentMonthlyTempo: number;
}): {
  planForecastAmount: number;
  currentForecastAmount: number;
} {
  const { plan, currentMonthlyTempo } = args;

  if (!plan) {
    return {
      planForecastAmount: 0,
      currentForecastAmount: 0,
    };
  }

  const planResult = calculateCapital(plan);

  const currentTempoPlan: PlanSettings = {
    ...plan,
    monthlyContribution: String(Math.round(currentMonthlyTempo)),
  };

  const currentTempoResult = calculateCapital(currentTempoPlan);

  return {
    planForecastAmount: planResult.success ? planResult.nominalCapital : 0,
    currentForecastAmount: currentTempoResult.success
      ? currentTempoResult.nominalCapital
      : 0,
  };
}

export function getForecastStatusText(args: {
  planForecastAmount: number;
  currentForecastAmount: number;
}): string {
  const { planForecastAmount, currentForecastAmount } = args;
  const diff = currentForecastAmount - planForecastAmount;
  const tolerance = Math.max(planForecastAmount * 0.01, 1);

  if (diff > tolerance) {
    return "Текущий темп выше плана";
  }

  if (diff < -tolerance) {
    return "Текущий темп ниже плана";
  }

  return "Текущий темп сохраняет план";
}

export function getOverviewHeroStatusText(deviation: number): string {
  return deviation >= 0 ? "Темп нормальный" : "Есть отставание";
}

export function getLegacyStatusTitle(deviation: number): string {
  return deviation >= 0 ? "План выполняется" : "Есть отставание от плана";
}

export function getMonthLabel(): string {
  return new Intl.DateTimeFormat("ru-RU", {
    month: "long",
  }).format(new Date());
}

export function getMonthLabelGenitive(): string {
  const names = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ];

  return names[new Date().getMonth()];
}

export function getActionHintText(args: {
  monthlyPlan: number;
  remainingAmount: number;
  deviation: number;
  monthLabelGenitive: string;
  formatNumber: (value: number) => string;
}): string {
  const {
    monthlyPlan,
    remainingAmount,
    deviation,
    monthLabelGenitive,
    formatNumber,
  } = args;

  if (monthlyPlan <= 0) {
    return "План на месяц пока не задан. Укажите сумму ежемесячного взноса в стратегии.";
  }

  if (remainingAmount <= 0) {
    return `План ${monthLabelGenitive} уже закрыт. Текущий темп можно просто сохранить.`;
  }

  if (deviation >= 0) {
    return `До плана ${monthLabelGenitive} осталось внести ${formatNumber(
      remainingAmount
    )} ₽. После закрытия месяца текущий темп сохранится.`;
  }

  return `До плана ${monthLabelGenitive} осталось внести ${formatNumber(
    remainingAmount
  )} ₽. Закрытие месяца поможет сократить отставание.`;
}