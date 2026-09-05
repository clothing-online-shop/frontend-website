"use client";

import { AccountLayout } from "@/components/account/AccountLayout";
import { ProfileForm } from "./ProfileForm";

export default function AccountPage() {
  return <AccountLayout>{(user) => <ProfileForm user={user} />}</AccountLayout>;
}
