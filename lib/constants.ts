export const ASSET_CATEGORIES = [
  "Cash",
  "Акции",
  "Облигации",
  "Валюта",
  "Металлы",
  "Недвижимость",
  "Депозиты",
  "Крипта",
  "Прочее",
] as const;

export type AssetCategory = (typeof ASSET_CATEGORIES)[number];

export function normalizeAssetCategory(
  category: string | null | undefined
): string {
  if (!category) return "Прочее";

  const normalized = category.trim();

  const aliasMap: Record<string, string> = {
    "Кэш в рублях": "Cash",
    "Кэш": "Cash",
    Cash: "Cash",

    "Акции/облигации": "Акции",
    Акции: "Акции",
    Облигации: "Облигации",

    "Драгметаллы": "Металлы",
    Металлы: "Металлы",

    Недвижимость: "Недвижимость",
    Валюта: "Валюта",
    Депозиты: "Депозиты",
    Крипта: "Крипта",
    Прочее: "Прочее",

    "Без категории": "Прочее",
  };

  return aliasMap[normalized] ?? normalized;
}