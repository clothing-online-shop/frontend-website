import { apiClient } from "@/lib/api-client";
import type { ActivePopup } from "@/lib/shared-types";

export async function getActivePopup(): Promise<ActivePopup | null> {
  const { data } = await apiClient.get<ActivePopup | null>("/popups/active");
  return data;
}
