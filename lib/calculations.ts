export type CapitalCalculationInput = {
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

export function calculateCapital(
  input: CapitalCalculationInput
): CapitalCalculationResult {
  const start = Number(input.initialCapital);
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
    start,
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
      success: false,
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
      success: false,
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

  const portfolioRate = portfolioRatePercent / 100;
  const inflationRate = inflationValue / 100;
  const growthRate = contributionGrowthValue / 100;

  let capital = start;
  let currentMonthly = monthly;

  for (let i = 0; i < yearsValue; i += 1) {
    const yearly = currentMonthly * 12;
    const income = capital * portfolioRate;
    capital += yearly + income;
    currentMonthly *= 1 + growthRate;
  }

  const realCapital = capital / Math.pow(1 + inflationRate, yearsValue);

  return {
    success: true,
    portfolioRatePercent,
    nominalCapital: capital,
    realCapital,
    otherSharePercent: otherShareValue,
    totalManualShare,
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