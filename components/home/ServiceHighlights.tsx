import { CreditCard, Headset, RefreshCw, Truck } from "lucide-react";

// Nội dung tĩnh — trùng đúng thông tin thật đã dùng ở Footer.tsx (hotline, COD/chuyển
// khoản/VNPay) và ProductPolicyInfo.tsx (freeship 500k, đổi size 7 ngày), không phải số liệu
// bịa mới, chỉ dựng lại dạng dải 4 cột cho trang chủ.
const ITEMS = [
  {
    icon: Truck,
    title: "Miễn phí vận chuyển",
    description: "Đơn từ 500.000đ, toàn quốc",
  },
  {
    icon: RefreshCw,
    title: "Đổi size 7 ngày",
    description: "Còn nguyên tem, shop chịu phí",
  },
  {
    icon: CreditCard,
    title: "Thanh toán linh hoạt",
    description: "COD, chuyển khoản, VNPay",
  },
  {
    icon: Headset,
    title: "Hỗ trợ 9:00 – 21:00",
    description: "Hotline 1900 6868, có chat luôn",
  },
];

export function ServiceHighlights() {
  return (
    <div className="mb-14 mx-auto max-w-full border-l-0 border-r-0 border border-border">
      <div className="max-w-[1440px] w-full mx-auto grid grid-cols-2 gap-y-6 sm:h-[80px] sm:grid-cols-4 sm:gap-y-0 sm:divide-x sm:divide-border">
        {ITEMS.map((item) => (
          <div key={item.title} className="flex items-center gap-3 px-4 py-4">
            <item.icon className="size-6 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-bold text-foreground mb-2">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
