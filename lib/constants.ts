export const ASSET_CATEGORIES = [
  "Акции/облигации",
  "Кэш в рублях",
  "Драгметаллы",
  "Недвижимость",
  "Валюта",
  "Прочее",
] as const;

export type AssetCategory = (typeof ASSET_CATEGORIES)[number];