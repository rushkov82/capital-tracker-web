export type CapitalCalculationInput = {
  initialCapital?: string;
  monthlyContribution: string;
  inflation: string;
  contributionGrowth: string;
  years: string;

  stocksBondsShare: string;
  stocksBondsReturn: string;

  bondsShare: string;
  bondsReturn: string;

  rubCashShare: string;
  rubCashReturn: string;

  currencyShare: string;
  currencyReturn: string;

  metalsShare: string;
  metalsReturn: string;

  realEstateShare: string;
  realEstateReturn: string;

  depositsShare: string;
  depositsReturn: string;

  cryptoShare: string;
  cryptoReturn: string;

  otherShare: string;
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
  const initialCapitalValue = Number(input.initialCapital || 0);
  const monthly = Number(input.monthlyContribution);
  const inflationValue = Number(input.inflation);
  const contributionGrowthValue = Number(input.contributionGrowth);
  const yearsValue = Number(input.years);

  const stocksBondsShareValue = Number(input.stocksBondsShare);
  const stocksBondsReturnValue = Number(input.stocksBondsReturn);

  const bondsShareValue = Number(input.bondsShare);
  const bondsReturnValue = Number(input.bondsReturn);

  const rubCashShareValue = Number(input.rubCashShare);
  const rubCashReturnValue = Number(input.rubCashReturn);

  const currencyShareValue = Number(input.currencyShare);
  const currencyReturnValue = Number(input.currencyReturn);

  const metalsShareValue = Number(input.metalsShare);
  const metalsReturnValue = Number(input.metalsReturn);

  const realEstateShareValue = Number(input.realEstateShare);
  const realEstateReturnValue = Number(input.realEstateReturn);

  const depositsShareValue = Number(input.depositsShare);
  const depositsReturnValue = Number(input.depositsReturn);

  const cryptoShareValue = Number(input.cryptoShare);
  const cryptoReturnValue = Number(input.cryptoReturn);

  const otherShareValue = Number(input.otherShare);
  const otherReturnValue = Number(input.otherReturn);

  const values = [
    initialCapitalValue,
    monthly,
    inflationValue,
    contributionGrowthValue,
    yearsValue,

    stocksBondsShareValue,
    stocksBondsReturnValue,

    bondsShareValue,
    bondsReturnValue,

    rubCashShareValue,
    rubCashReturnValue,

    currencyShareValue,
    currencyReturnValue,

    metalsShareValue,
    metalsReturnValue,

    realEstateShareValue,
    realEstateReturnValue,

    depositsShareValue,
    depositsReturnValue,

    cryptoShareValue,
    cryptoReturnValue,

    otherShareValue,
    otherReturnValue,
  ];

  if (values.some((v) => Number.isNaN(v))) {
    return {
      success: false as const,
      error: "Введите корректные данные",
    };
  }

  if (yearsValue < 0) {
    return {
      success: false as const,
      error: "Срок накопления не может быть отрицательным",
    };
  }

  const totalManualShare =
    stocksBondsShareValue +
    bondsShareValue +
    rubCashShareValue +
    currencyShareValue +
    metalsShareValue +
    realEstateShareValue +
    depositsShareValue +
    cryptoShareValue +
    otherShareValue;

  if (totalManualShare > 100) {
    return {
      success: false as const,
      error: "Сумма долей превышает 100%",
    };
  }

  const portfolioRatePercent =
    (stocksBondsShareValue * stocksBondsReturnValue +
      bondsShareValue * bondsReturnValue +
      rubCashShareValue * rubCashReturnValue +
      currencyShareValue * currencyReturnValue +
      metalsShareValue * metalsReturnValue +
      realEstateShareValue * realEstateReturnValue +
      depositsShareValue * depositsReturnValue +
      cryptoShareValue * cryptoReturnValue +
      otherShareValue * otherReturnValue) /
    100;

  return {
    success: true as const,
    initialCapitalValue,
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

  const totalMonths = Math.max(0, Math.round(parsed.yearsValue * 12));
  const portfolioRate = parsed.portfolioRatePercent / 100;
  const monthlyRate =
    portfolioRate <= -1 ? -1 : Math.pow(1 + portfolioRate, 1 / 12) - 1;

  const inflationRate = parsed.inflationValue / 100;
  const growthRate = parsed.contributionGrowthValue / 100;

  let capital = parsed.initialCapitalValue;
  let currentMonthly = parsed.monthly;

  for (let month = 0; month < totalMonths; month += 1) {
    capital += currentMonthly;
    capital *= 1 + monthlyRate;

    if ((month + 1) % 12 === 0) {
      currentMonthly *= 1 + growthRate;
    }
  }

  const realCapital =
    capital / Math.pow(1 + inflationRate, parsed.yearsValue);

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
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value);
}