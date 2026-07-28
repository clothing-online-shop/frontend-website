import { apiClient } from "@/lib/api-client";
import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  AuthUser,
  ForgotPasswordPayload,
} from "@/lib/shared-types";

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>("/auth/login", payload);
  return data;
}

export async function register(payload: RegisterPayload): Promise<AuthUser> {
  const { data } = await apiClient.post<AuthUser>("/auth/register", payload);
  return data;
}

export async function forgotPassword(payload: ForgotPasswordPayload): Promise<void> {
  await apiClient.post("/auth/forgot-password", payload);
}
