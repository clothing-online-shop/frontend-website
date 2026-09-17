"use client";

import { AccountLayout } from "@/components/account/AccountLayout";
import { WishlistPageClient } from "./WishlistPageClient";

export default function WishlistPage() {
  return <AccountLayout>{() => <WishlistPageClient />}</AccountLayout>;
}
