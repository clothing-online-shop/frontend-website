"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { ProductDetail } from "@/lib/shared-types";

// Nội dung tĩnh, áp dụng chung cho mọi sản phẩm (chính sách đổi trả không phải field riêng
// từng sản phẩm) — khác Mô tả/Chất liệu/Bảo quản đều lấy từ dữ liệu sản phẩm thật.
const RETURN_POLICY_TEXT =
  "Đổi hàng trong 7 ngày kể từ ngày nhận, sản phẩm còn nguyên tem mác, chưa qua sử dụng. " +
  "Liên hệ CSKH qua mục Hỗ trợ ở footer để được hướng dẫn quy trình đổi trả.";

// Chỉ cần toggle hiện/ẩn 1 panel tại 1 thời điểm — không cần base-ui Accordion (vốn cho
// portal/focus-trap phức tạp hơn nhiều so với nhu cầu ở đây), dùng thẳng thẻ html5 +
// useState để tự do chỉnh CSS trực tiếp, không bị class có sẵn của component nào ghi đè.
export function ProductTabs({ product }: { product: ProductDetail }) {
  const [openItem, setOpenItem] = useState<string | null>(null);

  function toggle(value: string) {
    setOpenItem((current) => (current === value ? null : value));
  }

  return (
    <div className="mt-10 divide-y divide-neutral-EDEBE8 border-t border-neutral-EDEBE8">
      <div>
        <button
          type="button"
          onClick={() => toggle("chi-tiet")}
          aria-expanded={openItem === "chi-tiet"}
          className="group flex w-full cursor-pointer items-center justify-between py-6.5 text-left text-size-22 text-foreground transition-colors outline-none hover:text-brand-10"
        >
          Thông tin chi tiết
          <Plus className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-aria-expanded:rotate-45" />
        </button>
        {openItem === "chi-tiet" ? (
          <div className="pb-4 text-sm text-foreground/90">
            {product.description ? (
              <div className="rich-content -mt-2.5 mb-6 text-justify" dangerouslySetInnerHTML={{ __html: product.description }} />
            ) : null}
            {product.material ? (
              <div>
                <p className="mb-2 font-semibold text-size-14 text-brand-10">Chất liệu</p>
                <p  className="mb-6.5 text-size-14 text-neutral-3F3A34 text-justify">{product.material}</p>
              </div>
            ) : null}
            {product.careInstructions ? (
              <div>
                <p className="mb-2 font-semibold text-size-14 text-brand-10">Hướng dẫn bảo quản</p>
                <p className="mb-6.5 text-size-14 text-neutral-3F3A34 text-justify">{product.careInstructions}</p>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div>
        <button
          type="button"
          onClick={() => toggle("doi-tra")}
          aria-expanded={openItem === "doi-tra"}
          className="group flex w-full cursor-pointer items-center justify-between py-6.5 text-left text-size-22 text-foreground transition-colors outline-none hover:text-brand-10"
        >
          Chính sách đổi trả hàng
          <Plus className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-aria-expanded:rotate-45" />
        </button>
        {openItem === "doi-tra" ? (
          <div className="pb-4 text-sm text-foreground/90">
            <p className="mb-6.5 text-size-14 text-neutral-3F3A34 text-justify">{RETURN_POLICY_TEXT}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
