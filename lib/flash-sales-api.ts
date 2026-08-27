import { apiClient } from "@/lib/api-client";
import type { ActiveFlashSale } from "@/lib/shared-types";

export async function getActiveFlashSale(): Promise<ActiveFlashSale | null> {
  const { data } = await apiClient.get<ActiveFlashSale | null>("/flash-sales/active");
  return data;
}
