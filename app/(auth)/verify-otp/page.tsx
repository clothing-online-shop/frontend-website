import { Suspense } from "react";
import { VerifyOtpForm } from "./VerifyOtpForm";

export default function VerifyOtpPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4">
      <Suspense>
        <VerifyOtpForm />
      </Suspense>
    </div>
  );
}
