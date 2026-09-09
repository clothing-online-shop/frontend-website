import { apiClient } from "@/lib/api-client";
import type { ValidateVoucherPayload, VoucherValidationResult } from "@/lib/shared-types";

export async function validateVoucher(
  payload: ValidateVoucherPayload,
): Promise<VoucherValidationResult> {
  const { data } = await apiClient.post<VoucherValidationResult>("/vouchers/validate", payload);
  return data;
}
