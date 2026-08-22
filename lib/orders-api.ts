import { apiClient } from "@/lib/api-client";
import type { CreateOrderPayload, Order } from "@/lib/shared-types";

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const { data } = await apiClient.post<Order>("/orders", payload);
  return data;
}

export async function getOrder(orderCode: string): Promise<Order> {
  const { data } = await apiClient.get<Order>(`/orders/${orderCode}`);
  return data;
}
