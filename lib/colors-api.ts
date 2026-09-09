import { apiClient } from "@/lib/api-client";
import type { Color } from "@/lib/shared-types";

export async function getColors(): Promise<Color[]> {
  const { data } = await apiClient.get<Color[]>("/colors");
  return data;
}
