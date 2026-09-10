"use client";

import { Suspense } from "react";
import { AccountLayout } from "@/components/account/AccountLayout";
import { OrdersPageClient } from "./OrdersPageClient";

export default function AccountOrdersPage() {
  return (
    <AccountLayout>
      {() => (
        <Suspense>
          <OrdersPageClient />
        </Suspense>
      )}
    </AccountLayout>
  );
}
