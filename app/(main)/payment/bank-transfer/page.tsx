import { Suspense } from "react";
import { BankTransferContent } from "./BankTransferContent";

export default function BankTransferPage() {
  return (
    <Suspense>
      <BankTransferContent />
    </Suspense>
  );
}
