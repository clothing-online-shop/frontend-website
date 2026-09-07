import { apiClient } from "@/lib/api-client";
import type { RecentlyViewedItem } from "@/lib/shared-types";

export async function recordView(productId: string): Promise<void> {
  await apiClient.post("/recently-viewed", { productId });
}

export async function getRecentlyViewed(): Promise<RecentlyViewedItem[]> {
  const { data } = await apiClient.get<RecentlyViewedItem[]>("/recently-viewed");
  return data;
}
