import { apiClient } from "@/lib/api-client";
import type { ActiveCollection } from "@/lib/shared-types";

export async function getActiveCollection(): Promise<ActiveCollection | null> {
  const { data } = await apiClient.get<ActiveCollection | null>("/collections/active");
  return data;
}

export async function getCollectionBySlug(slug: string): Promise<ActiveCollection> {
  const { data } = await apiClient.get<ActiveCollection>(`/collections/${slug}`);
  return data;
}
