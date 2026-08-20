import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className="inline-block">
      <span
        className={cn(
          "inline-block bg-primary px-2.5 py-1 font-heading font-extrabold text-primary-foreground uppercase",
          className,
        )}
      >
        Clothing Shop
      </span>
    </Link>
  );
}
