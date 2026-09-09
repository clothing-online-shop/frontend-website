import { apiClient } from "@/lib/api-client";

export async function recordSearch(keyword: string): Promise<void> {
  await apiClient.post("/search-history", { keyword });
}

// BE luôn trả tối đa 5 từ khoá gần nhất, mới nhất trước.
export async function getRecentSearches(): Promise<string[]> {
  const { data } = await apiClient.get<string[]>("/search-history");
  return data;
}
