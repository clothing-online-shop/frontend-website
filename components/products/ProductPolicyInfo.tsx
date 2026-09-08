const POLICY_LINES = [
  "Giao 2-4 ngày qua GHN — phí tính theo địa chỉ ở bước thanh toán",
  "Freeship đơn từ 500.000đ",
  "Đổi size trong 7 ngày, còn nguyên tem",
];

export function ProductPolicyInfo() {
  return (
    <div className="mt-6 space-y-1.5 border border-border bg-white p-4 text-sm text-foreground/90">
      {POLICY_LINES.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
  );
}
