import { generatedAssets } from "@/config/generated-assets";
import type { AssetCategory, PlannerAsset } from "@/types/assets";

export const plannerAssets: PlannerAsset[] = [...generatedAssets];

export function getAssetsByCategory(category: AssetCategory) {
  return plannerAssets.filter((asset) => asset.category === category);
}
