import { apiClient } from "@/lib/api-client";
import type { HeroBanner } from "@/lib/shared-types";

export async function getActiveBanners(): Promise<HeroBanner[]> {
  const { data } = await apiClient.get<HeroBanner[]>("/banners/active");
  return data;
}
