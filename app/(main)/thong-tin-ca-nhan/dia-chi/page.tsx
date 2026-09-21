"use client";

import { AccountLayout } from "@/components/account/AccountLayout";
import { FeaturePlaceholder } from "@/components/account/FeaturePlaceholder";

export default function AddressPage() {
  return <AccountLayout>{() => <FeaturePlaceholder title="Địa chỉ" />}</AccountLayout>;
}
