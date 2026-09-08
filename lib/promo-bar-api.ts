import { apiClient } from "@/lib/api-client";
import type { ActivePromoBar } from "@/lib/shared-types";

export async function getActivePromoBar(): Promise<ActivePromoBar | null> {
  const { data } = await apiClient.get<ActivePromoBar | null>("/promo-bars/active");
  return data;
}
