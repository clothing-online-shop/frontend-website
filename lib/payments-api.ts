import { apiClient } from "@/lib/api-client";
import type {
  BankTransferInfo,
  InitiateVnpayResponse,
  VerifyVnpayReturnResponse,
} from "@/lib/shared-types";

export async function initiateVnpayPayment(orderId: string): Promise<InitiateVnpayResponse> {
  const { data } = await apiClient.post<InitiateVnpayResponse>(`/payments/${orderId}/vnpay`, {});
  return data;
}

export async function initiateBankTransfer(orderId: string): Promise<BankTransferInfo> {
  const { data } = await apiClient.post<BankTransferInfo>(
    `/payments/${orderId}/bank-transfer`,
    {},
  );
  return data;
}

// query nhận nguyên object các tham số vnp_* mà VNPay redirect kèm theo — chuyển tiếp
// nguyên vẹn cho BE verify chữ ký, không tự lọc/đổi tên field ở đây.
export async function verifyVnpayReturn(
  query: Record<string, string>,
): Promise<VerifyVnpayReturnResponse> {
  const { data } = await apiClient.get<VerifyVnpayReturnResponse>("/payments/vnpay/return", {
    params: query,
  });
  return data;
}
