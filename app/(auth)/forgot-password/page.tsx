import { redirect } from "next/navigation";

// Quên mật khẩu giờ là 1 tab trong box đăng nhập (app/(main)/login) — giữ route này lại làm
// redirect để link cũ (nếu có) vẫn vào đúng chỗ, không vỡ thành 404.
export default async function ForgotPasswordRedirectPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = new URLSearchParams();
  params.set("tab", "forgot");
  const resolvedSearchParams = await searchParams;
  for (const [key, value] of Object.entries(resolvedSearchParams)) {
    if (typeof value === "string") params.set(key, value);
  }
  redirect(`/login?${params.toString()}`);
}
