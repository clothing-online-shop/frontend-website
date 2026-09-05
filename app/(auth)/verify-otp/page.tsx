import { Suspense } from "react";
import { VerifyOtpForm } from "./VerifyOtpForm";

export default function VerifyOtpPage() {
  return (
    <Suspense>
      <VerifyOtpForm />
    </Suspense>
  );
}
