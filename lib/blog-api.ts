import { apiClient } from "@/lib/api-client";
import type { BlogPostSummary } from "@/lib/shared-types";

export async function getLatestBlogPosts(): Promise<BlogPostSummary[]> {
  const { data } = await apiClient.get<BlogPostSummary[]>("/blog-posts/latest");
  return data;
}
