import { Skeleton } from "@/components/ui/skeleton";

export function CartSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6 border-t border-border pt-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex gap-4 border-b border-border pb-6">
            <Skeleton className="size-24 shrink-0 rounded-none" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-13 w-40 rounded-none" />
            </div>
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
      <Skeleton className="h-80 w-full rounded-none" />
    </div>
  );
}
