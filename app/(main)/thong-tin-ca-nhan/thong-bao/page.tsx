"use client";

import { AccountLayout } from "@/components/account/AccountLayout";
import { FeaturePlaceholder } from "@/components/account/FeaturePlaceholder";

export default function NotificationsPage() {
  return <AccountLayout>{() => <FeaturePlaceholder title="Thông báo" />}</AccountLayout>;
}
