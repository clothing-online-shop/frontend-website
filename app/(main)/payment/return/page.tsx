import { Suspense } from "react";
import { PaymentReturnContent } from "./PaymentReturnContent";

export default function PaymentReturnPage() {
  return (
    <Suspense>
      <PaymentReturnContent />
    </Suspense>
  );
}
