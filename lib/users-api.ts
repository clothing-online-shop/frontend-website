import { apiClient } from "@/lib/api-client";
import type { AuthUser, Gender } from "@/lib/shared-types";

export interface UpdateProfilePayload {
  fullName?: string;
  dateOfBirth?: string;
  gender?: Gender;
  avatarUrl?: string | null;
  avatarPublicId?: string | null;
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<AuthUser> {
  const { data } = await apiClient.patch<AuthUser>("/users/me", payload);
  return data;
}

// Đổi SĐT/Email thật phải qua OTP (BE: request-change cần mật khẩu hiện tại → gửi OTP →
// confirm-change bằng mã 6 số) — không gộp được vào updateProfile() ở trên, xem
// components/account/ChangeContactDialog.tsx.
export interface RequestPhoneChangePayload {
  newPhone: string;
  currentPassword: string;
}

export interface ConfirmPhoneChangePayload {
  newPhone: string;
  code: string;
}

export interface RequestEmailChangePayload {
  newEmail: string;
  currentPassword: string;
}

export interface ConfirmEmailChangePayload {
  newEmail: string;
  code: string;
}

export async function requestPhoneChange(payload: RequestPhoneChangePayload): Promise<{ message: string }> {
  const { data } = await apiClient.post("/users/me/phone/request-change", payload);
  return data;
}

export async function confirmPhoneChange(payload: ConfirmPhoneChangePayload): Promise<AuthUser> {
  const { data } = await apiClient.post<AuthUser>("/users/me/phone/confirm-change", payload);
  return data;
}

export async function requestEmailChange(payload: RequestEmailChangePayload): Promise<{ message: string }> {
  const { data } = await apiClient.post("/users/me/email/request-change", payload);
  return data;
}

export async function confirmEmailChange(payload: ConfirmEmailChangePayload): Promise<AuthUser> {
  const { data } = await apiClient.post<AuthUser>("/users/me/email/confirm-change", payload);
  return data;
}
