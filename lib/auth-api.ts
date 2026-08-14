import { apiClient } from "@/lib/api-client";
import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  AuthUser,
  ForgotPasswordPayload,
  VerifyOtpPayload,
  ResendOtpPayload,
  ResetPasswordPayload,
  LogoutPayload,
} from "@/lib/shared-types";

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>("/auth/login", payload);
  return data;
}

export async function register(payload: RegisterPayload): Promise<AuthUser> {
  const { data } = await apiClient.post<AuthUser>("/auth/register", payload);
  return data;
}

export async function verifyOtp(payload: VerifyOtpPayload): Promise<void> {
  await apiClient.post("/auth/verify-otp", payload);
}

export async function resendOtp(payload: ResendOtpPayload): Promise<void> {
  await apiClient.post("/auth/resend-otp", payload);
}

export async function forgotPassword(payload: ForgotPasswordPayload): Promise<void> {
  await apiClient.post("/auth/forgot-password", payload);
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<void> {
  await apiClient.post("/auth/reset-password", payload);
}

export async function logout(payload: LogoutPayload): Promise<void> {
  await apiClient.post("/auth/logout", payload);
}
