import { redirect } from "next/navigation";

// OTP giờ là 1 tab trong box đăng nhập (app/(main)/login) — giữ route này lại làm redirect
// để link kích hoạt cũ trong email (/verify-otp?email=...&code=...) vẫn tự mở đúng tab OTP
// kèm email/code, không vỡ thành 404.
export default async function VerifyOtpRedirectPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = new URLSearchParams();
  params.set("tab", "otp");
  const resolvedSearchParams = await searchParams;
  for (const [key, value] of Object.entries(resolvedSearchParams)) {
    if (typeof value === "string") params.set(key, value);
  }
  redirect(`/login?${params.toString()}`);
}
