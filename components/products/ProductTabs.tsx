"use client";

import { useState } from "react";
import type { ProductDetail } from "@/lib/shared-types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Nội dung tĩnh, áp dụng chung cho mọi sản phẩm (chính sách đổi trả không phải field riêng
// từng sản phẩm) — khác 3 tab kia đều lấy từ dữ liệu sản phẩm thật.
const RETURN_POLICY_TEXT =
  "Đổi hàng trong 7 ngày kể từ ngày nhận, sản phẩm còn nguyên tem mác, chưa qua sử dụng. " +
  "Liên hệ CSKH qua mục Hỗ trợ ở footer để được hướng dẫn quy trình đổi trả.";

export function ProductTabs({ product }: { product: ProductDetail }) {
  const tabs = [
    product.description
      ? { value: "mo-ta", label: "Mô tả", content: product.description, isHtml: true }
      : null,
    product.material ? { value: "chat-lieu", label: "Chất liệu", content: product.material } : null,
    product.careInstructions
      ? { value: "bao-quan", label: "Bảo quản", content: product.careInstructions }
      : null,
    { value: "doi-tra", label: "Đổi trả", content: RETURN_POLICY_TEXT },
  ].filter((tab): tab is NonNullable<typeof tab> => tab !== null);

  const [active, setActive] = useState(tabs[0]?.value);

  return (
    <Tabs value={active} onValueChange={(value) => setActive(value as string)} className="mt-10">
      <TabsList variant="line" className="w-full justify-start border-b border-border">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} className="text-sm font-bold">
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="pt-4 text-foreground/90">
          {tab.isHtml ? (
            <div className="rich-content" dangerouslySetInnerHTML={{ __html: tab.content }} />
          ) : (
            <p>{tab.content}</p>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}
