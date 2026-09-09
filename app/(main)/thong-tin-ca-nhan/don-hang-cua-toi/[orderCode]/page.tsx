"use client";

import { useParams } from "next/navigation";
import { AccountLayout } from "@/components/account/AccountLayout";
import { OrderDetailContent } from "./OrderDetailContent";

export default function AccountOrderDetailPage() {
  const params = useParams<{ orderCode: string }>();
  return <AccountLayout>{() => <OrderDetailContent orderCode={params.orderCode} />}</AccountLayout>;
}
