import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex items-baseline whitespace-nowrap font-heading text-xl", className)}>
      <span className="italic">Phương Phương</span>
    </Link>
  );
}
