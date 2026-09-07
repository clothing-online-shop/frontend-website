export function formatPrice(value: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string | Date): string {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

// Không kèm năm — dùng cho PromoBar (khoảng ngày kiểu "11/08 – 23/08"), khác formatDate()
// vốn luôn kèm năm. Tự ghép "dd/MM" thay vì dùng Intl.DateTimeFormat({ day, month }) — ICU
// vi-VN đổi dấu phân cách thành "-" (vd "07-10") khi bỏ year, không cho ra "/" như mong đợi.
export function formatDayMonth(value: string | Date): string {
  const date = new Date(value);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}`;
}

// Che bớt SĐT lúc chưa bấm "Đổi" — giữ nguyên 4 số đầu + 2 số cuối, phần giữa thay bằng
// "••••" bất kể còn lại bao nhiêu số, đúng kiểu hiển thị trong mockup.
export function maskPhone(phone: string): string {
  if (!phone || phone.length <= 6) return phone;
  return `${phone.slice(0, 4)} •••• ${phone.slice(-2)}`;
}
