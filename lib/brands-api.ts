import { apiClient } from "@/lib/api-client";
import type { Brand } from "@/lib/shared-types";

export async function getBrands(): Promise<Brand[]> {
  const { data } = await apiClient.get<Brand[]>("/brands");
  return data;
}
