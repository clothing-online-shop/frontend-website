import { apiClient } from "@/lib/api-client";
import type {
  PaginatedResult,
  ProductDetail,
  ProductListItem,
  ProductSort,
} from "@/lib/shared-types";

export interface ListProductsParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  color?: string;
  brand?: string;
  search?: string;
  sort?: ProductSort;
  page?: number;
  limit?: number;
}

export async function getProducts(
  params: ListProductsParams = {},
): Promise<PaginatedResult<ProductListItem>> {
  const { data } = await apiClient.get<PaginatedResult<ProductListItem>>("/products", {
    params,
  });
  return data;
}

export async function getProductBySlug(slug: string): Promise<ProductDetail> {
  const { data } = await apiClient.get<ProductDetail>(`/products/${slug}`);
  return data;
}
