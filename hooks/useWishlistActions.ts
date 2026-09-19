"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addWishlistItem, removeWishlistItem } from "@/lib/wishlist-api";

// Chung queryKey giữa nút tim (WishlistButton), trang yêu thích và badge ở header — đổi 1 nơi thì
// mọi nơi tự cập nhật theo, không cần refresh trang.
export const WISHLIST_KEY = ["wishlist"];

export const WISHLIST_PAGE_PATH = "/thong-tin-ca-nhan/san-pham-yeu-thich";

export const WISHLIST_TOAST = {
  added: "Đã thêm vào danh sách yêu thích",
  removed: "Đã bỏ khỏi danh sách yêu thích",
  view: "Xem",
  undo: "Hoàn tác",
  loginRequired: "Vui lòng đăng nhập để lưu sản phẩm yêu thích",
  error: "Có lỗi xảy ra, vui lòng thử lại.",
} as const;

// Thêm/bỏ yêu thích kèm toast: thêm → có nút "Xem" mở trang yêu thích; bỏ → có nút "Hoàn tác"
// (thêm lại đúng sản phẩm vừa bỏ, đề phòng bấm nhầm tim).
export function useWishlistActions() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: WISHLIST_KEY });

  const add = useMutation({
    mutationFn: addWishlistItem,
    onSuccess: () => {
      void refresh();
      toast.success(WISHLIST_TOAST.added, {
        action: { label: WISHLIST_TOAST.view, onClick: () => router.push(WISHLIST_PAGE_PATH) },
      });
    },
    onError: () => toast.error(WISHLIST_TOAST.error),
  });

  const remove = useMutation({
    mutationFn: removeWishlistItem,
    onSuccess: (_data, productId) => {
      void refresh();
      toast(WISHLIST_TOAST.removed, {
        action: { label: WISHLIST_TOAST.undo, onClick: () => add.mutate(productId) },
      });
    },
    onError: () => toast.error(WISHLIST_TOAST.error),
  });

  // Chưa đăng nhập thì báo lý do trước khi chuyển sang trang đăng nhập — không thì người dùng
  // bấm tim rồi bị đưa sang /login mà không hiểu vì sao.
  function requireLogin() {
    toast.info(WISHLIST_TOAST.loginRequired);
    router.push("/login");
  }

  return { add, remove, requireLogin, isPending: add.isPending || remove.isPending };
}
