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

// "0912345678" -> "0912 345 678" — chỉ để hiện đẹp hơn ở caption/label, không dùng để gửi
// lên BE (BE luôn nhận số thuần, không dấu cách).
export function formatPhoneDisplay(phone: string): string {
  return phone.replace(/(\d{4})(\d{3})(\d+)/, "$1 $2 $3");
}
