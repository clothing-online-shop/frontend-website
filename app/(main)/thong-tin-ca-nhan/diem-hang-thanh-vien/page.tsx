"use client";

import { AccountLayout } from "@/components/account/AccountLayout";
import { FeaturePlaceholder } from "@/components/account/FeaturePlaceholder";

export default function LoyaltyPage() {
  return <AccountLayout>{() => <FeaturePlaceholder title="Điểm & hạng thành viên" />}</AccountLayout>;
}
