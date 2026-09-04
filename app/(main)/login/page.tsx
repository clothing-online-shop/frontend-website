import { Suspense } from "react";
import { LoginTabs } from "./LoginTabs";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginTabs />
    </Suspense>
  );
}
