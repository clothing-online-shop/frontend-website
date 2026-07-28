import { apiClient } from "@/lib/api-client";
import type { CategoryNode } from "@/lib/shared-types";

export async function getCategoryTree(): Promise<CategoryNode[]> {
  const { data } = await apiClient.get<CategoryNode[]>("/categories");
  return data;
}

export async function getCategoryBySlug(slug: string): Promise<CategoryNode> {
  const { data } = await apiClient.get<CategoryNode>(`/categories/${slug}`);
  return data;
}
