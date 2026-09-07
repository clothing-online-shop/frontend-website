import { apiClient } from "@/lib/api-client";

export interface UploadResult {
  url: string;
  publicId: string;
}

export async function uploadImage(file: File): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await apiClient.post<UploadResult>("/upload/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

// publicId chứa "/" (VD clothing-shop/users/<id>/xyz) — encode để Express nhận đúng 1 param.
export async function deleteImage(publicId: string): Promise<void> {
  await apiClient.delete(`/upload/image/${encodeURIComponent(publicId)}`);
}
