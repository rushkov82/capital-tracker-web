export type CapitalCalculationInput = {
  initialCapital?: string;
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

export type CapitalCalculationResult =
  | {
      success: true;
      portfolioRatePercent: number;
      nominalCapital: number;
      realCapital: number;
      otherSharePercent: number;
      totalManualShare: number;
    }
  | {
      success: false;
      error: string;
    };

function parseInput(input: CapitalCalculationInput) {
  const monthly = Number(input.monthlyContribution);
  const inflationValue = Number(input.inflation);
  const contributionGrowthValue = Number(input.contributionGrowth);
  const yearsValue = Number(input.years);

  const stocksBondsShareValue = Number(input.stocksBondsShare);
  const stocksBondsReturnValue = Number(input.stocksBondsReturn);

  const rubCashShareValue = Number(input.rubCashShare);
  const rubCashReturnValue = Number(input.rubCashReturn);

  const metalsShareValue = Number(input.metalsShare);
  const metalsReturnValue = Number(input.metalsReturn);

  const realEstateShareValue = Number(input.realEstateShare);
  const realEstateReturnValue = Number(input.realEstateReturn);

  const currencyShareValue = Number(input.currencyShare);
  const currencyReturnValue = Number(input.currencyReturn);

  const otherReturnValue = Number(input.otherReturn);

  const values = [
    monthly,
    inflationValue,
    contributionGrowthValue,
    yearsValue,
    stocksBondsShareValue,
    stocksBondsReturnValue,
    rubCashShareValue,
    rubCashReturnValue,
    metalsShareValue,
    metalsReturnValue,
    realEstateShareValue,
    realEstateReturnValue,
    currencyShareValue,
    currencyReturnValue,
    otherReturnValue,
  ];

  if (values.some((v) => Number.isNaN(v))) {
    return {
      success: false as const,
      error: "Введите корректные данные",
    };
  }

  const totalManualShare =
    stocksBondsShareValue +
    rubCashShareValue +
    metalsShareValue +
    realEstateShareValue +
    currencyShareValue;

  if (totalManualShare > 100) {
    return {
      success: false as const,
      error: "Сумма долей превышает 100%",
    };
  }

  const otherShareValue = 100 - totalManualShare;

  const portfolioRatePercent =
    (stocksBondsShareValue * stocksBondsReturnValue +
      rubCashShareValue * rubCashReturnValue +
      metalsShareValue * metalsReturnValue +
      realEstateShareValue * realEstateReturnValue +
      currencyShareValue * currencyReturnValue +
      otherShareValue * otherReturnValue) /
    100;

  return {
    success: true as const,
    monthly,
    inflationValue,
    contributionGrowthValue,
    yearsValue,
    portfolioRatePercent,
    otherShareValue,
    totalManualShare,
  };
}

export function calculateCapital(
  input: CapitalCalculationInput
): CapitalCalculationResult {
  const parsed = parseInput(input);

  if (!parsed.success) {
    return parsed;
  }

  const portfolioRate = parsed.portfolioRatePercent / 100;
  const inflationRate = parsed.inflationValue / 100;
  const growthRate = parsed.contributionGrowthValue / 100;

  let capital = 0;
  let currentMonthly = parsed.monthly;

  for (let i = 0; i < parsed.yearsValue; i += 1) {
    const yearlyContribution = currentMonthly * 12;
    const yearlyIncome = capital * portfolioRate;

    capital += yearlyContribution + yearlyIncome;
    currentMonthly *= 1 + growthRate;
  }

  const realCapital = capital / Math.pow(1 + inflationRate, parsed.yearsValue);

  return {
    success: true,
    portfolioRatePercent: parsed.portfolioRatePercent,
    nominalCapital: capital,
    realCapital,
    otherSharePercent: parsed.otherShareValue,
    totalManualShare: parsed.totalManualShare,
  };
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number) {
  return new Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(value);
}