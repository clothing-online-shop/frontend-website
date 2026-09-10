import { apiClient } from "@/lib/api-client";
import type { CreateOrderPayload, Order, OrderStatus, PaginatedResult } from "@/lib/shared-types";

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const { data } = await apiClient.post<Order>("/orders", payload);
  return data;
}

export async function getOrder(orderCode: string): Promise<Order> {
  const { data } = await apiClient.get<Order>(`/orders/${orderCode}`);
  return data;
}

export interface ListMyOrdersParams {
  statuses?: OrderStatus[];
  page?: number;
  limit?: number;
}

export async function listMyOrders(
  params: ListMyOrdersParams = {},
): Promise<PaginatedResult<Order>> {
  const { data } = await apiClient.get<PaginatedResult<Order>>("/orders", {
    params: {
      status: params.statuses?.length ? params.statuses.join(",") : undefined,
      page: params.page,
      limit: params.limit,
    },
  });
  return data;
}

export async function cancelOrder(orderCode: string): Promise<Order> {
  const { data } = await apiClient.patch<Order>(`/orders/${orderCode}/cancel`);
  return data;
}
