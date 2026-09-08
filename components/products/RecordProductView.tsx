"use client";

import { useEffect } from "react";
import { recordView } from "@/lib/recently-viewed-api";

// Không render UI — chỉ ghi nhận 1 lượt xem khi khách mở trang chi tiết sản phẩm, phục vụ
// section "Đã xem gần đây" (RecentlyViewedSection.tsx). Lỗi ghi nhận không được chặn/hiện gì
// cho khách, đây chỉ là thao tác nền.
export function RecordProductView({ productId }: { productId: string }) {
  useEffect(() => {
    recordView(productId).catch(() => undefined);
  }, [productId]);

  return null;
}
