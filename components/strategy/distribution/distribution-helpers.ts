import type { PlanSettings } from "@/lib/plan";
import {
  ACTIVE_PRESET,
  BALANCED_PRESET,
  type DistributionMode,
} from "@/lib/strategy";
import {
  NON_CASH_KEYS,
  getDescriptor,
  toInt,
  type ManualCategoryKey,
} from "@/lib/strategy-distribution";

export const ALL_MANUAL_KEYS: ManualCategoryKey[] = ["cash", ...NON_CASH_KEYS];

export function buildDistributionSignature(plan: PlanSettings) {
  return ALL_MANUAL_KEYS.map((key) => {
    const descriptor = getDescriptor(key);
    return `${key}:${descriptor.getShare(plan)}:${descriptor.getReturn(plan)}`;
  }).join("|");
}

export function buildVisibleKeysSignature(keys: ManualCategoryKey[]) {
  return [...keys].sort().join("|");
}

export function buildVisibleKeysFromPlan(
  plan: PlanSettings
): ManualCategoryKey[] {
  const keys: ManualCategoryKey[] = ["cash"];

  for (const key of NON_CASH_KEYS) {
    if (toInt(getDescriptor(key).getShare(plan)) > 0) {
      keys.push(key);
    }
  }

  return keys;
}

export function mergeDistributionIntoPlan(
  basePlan: PlanSettings,
  distributionSource: PlanSettings
) {
  let nextPlan = { ...basePlan };

  for (const key of ALL_MANUAL_KEYS) {
    const descriptor = getDescriptor(key);

    nextPlan = descriptor.setShare(
      nextPlan,
      descriptor.getShare(distributionSource)
    );
    nextPlan = descriptor.setReturn(
      nextPlan,
      descriptor.getReturn(distributionSource)
    );
  }

  return nextPlan;
}

export function buildPlanForMode(
  basePlan: PlanSettings,
  mode: DistributionMode,
  manualDraftPlan: PlanSettings
) {
  if (mode === "cash") {
    return buildCashPlan(basePlan);
  }

  if (mode === "balanced") {
    return buildBalancedPlan(basePlan);
  }

  if (mode === "active") {
    return buildActivePlan(basePlan);
  }

  return mergeDistributionIntoPlan(basePlan, manualDraftPlan);
}

export function buildCashPlan(basePlan: PlanSettings) {
  return {
    ...basePlan,
    rubCashShare: "100",
    stocksBondsShare: "0",
    bondsShare: "0",
    currencyShare: "0",
    metalsShare: "0",
    realEstateShare: "0",
    depositsShare: "0",
    cryptoShare: "0",
    otherShare: "0",
  };
}

export function buildBalancedPlan(basePlan: PlanSettings) {
  return {
    ...basePlan,
    ...BALANCED_PRESET,
  };
}

export function buildActivePlan(basePlan: PlanSettings) {
  return {
    ...basePlan,
    ...ACTIVE_PRESET,
  };
}

export function getWeightedReturn(plan: PlanSettings) {
  return ALL_MANUAL_KEYS.reduce((sum, key) => {
    const descriptor = getDescriptor(key);
    const share = toInt(descriptor.getShare(plan));
    const expectedReturn = toInt(descriptor.getReturn(plan));

    return sum + (share * expectedReturn) / 100;
  }, 0);
}

export function formatPercent(value: number) {
  return value.toLocaleString("ru-RU", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });
}