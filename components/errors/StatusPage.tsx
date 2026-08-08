import Link from "next/link";
import { Home, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/layout/SearchBar";

export function StatusPage({
  code,
  title,
  description,
  onRetry,
}: {
  code?: string;
  title: string;
  description: string;
  onRetry?: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 py-24 text-center">
      {code ? (
        <p className="font-heading text-6xl font-semibold text-muted-foreground">{code}</p>
      ) : null}
      <h1 className="mt-2 font-heading text-2xl font-semibold">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>

      <SearchBar className="mt-6 w-full" />

      <div className="mt-5 flex items-center gap-3">
        <Button nativeButton={false} render={<Link href="/" />}>
          <Home className="size-4" />
          Về trang chủ
        </Button>
        {onRetry ? (
          <Button variant="outline" onClick={onRetry}>
            <RotateCw className="size-4" />
            Thử lại
          </Button>
        ) : null}
      </div>
    </div>
  );
}
