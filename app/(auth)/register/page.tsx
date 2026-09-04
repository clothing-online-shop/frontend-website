import { redirect } from "next/navigation";

// Đăng ký giờ là 1 tab trong box đăng nhập (app/(main)/login), không còn là trang riêng —
// giữ route này lại làm redirect để link cũ (nếu có bookmark/liên kết ngoài trỏ tới
// /register) vẫn vào đúng chỗ, không vỡ thành 404.
export default async function RegisterRedirectPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = new URLSearchParams();
  params.set("tab", "register");
  const resolvedSearchParams = await searchParams;
  for (const [key, value] of Object.entries(resolvedSearchParams)) {
    if (typeof value === "string") params.set(key, value);
  }
  redirect(`/login?${params.toString()}`);
}
