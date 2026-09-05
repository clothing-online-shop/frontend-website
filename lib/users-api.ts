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
