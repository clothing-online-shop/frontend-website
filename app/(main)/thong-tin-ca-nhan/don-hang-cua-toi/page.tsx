"use client";

import { AccountLayout } from "@/components/account/AccountLayout";
import { OrdersPageClient } from "./OrdersPageClient";

export default function AccountOrdersPage() {
  return <AccountLayout>{() => <OrdersPageClient />}</AccountLayout>;
}
