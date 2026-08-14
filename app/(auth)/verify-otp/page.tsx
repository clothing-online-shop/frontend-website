import { Suspense } from "react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { VerifyOtpForm } from "./VerifyOtpForm";

export default function VerifyOtpPage() {
  return (
    <AuthLayout>
      <Suspense>
        <VerifyOtpForm />
      </Suspense>
    </AuthLayout>
  );
}
