import axios from "axios";
import { useAuthStore } from "@/store/auth-store";
import { getGuestId } from "@/lib/guest-id";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  } else if (typeof window !== "undefined") {
    // Chỉ gắn ở client — localStorage không tồn tại khi apiClient được gọi từ Server
    // Component (getGuestId() dùng localStorage). Chỉ cần khi CHƯA đăng nhập (xem
    // lib/guest-id.ts) — request nào đã có Bearer token thì backend định danh theo user,
    // không cần header này.
    config.headers["X-Guest-Id"] = getGuestId();
  }
  return config;
});

let isRefreshing = false;
let pendingRequests: Array<() => void> = [];

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        pendingRequests.push(() => resolve(apiClient(originalRequest)));
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = useAuthStore.getState().refreshToken;
      if (!refreshToken) throw error;

      const { data } = await axios.post(`${API_URL}/auth/refresh`, {
        refreshToken,
      });
      useAuthStore.getState().setTokens(data.accessToken, data.refreshToken);

      pendingRequests.forEach((run) => run());
      pendingRequests = [];

      return apiClient(originalRequest);
    } catch (refreshError) {
      useAuthStore.getState().logout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
