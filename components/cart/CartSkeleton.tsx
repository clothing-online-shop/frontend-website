import { Skeleton } from "@/components/ui/skeleton";

export function CartSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6 border-t border-border pt-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col gap-3 border-b border-border pb-6 lg:flex-row lg:gap-4">
            <div className="flex gap-4 lg:contents">
              <Skeleton className="h-[106px] w-20 shrink-0 rounded-none sm:h-[142px] sm:w-[107px]" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="hidden h-13 w-40 rounded-none lg:block" />
              </div>
            </div>
            <Skeleton className="hidden h-10 w-20 rounded-none lg:block" />
            <div className="flex items-center justify-between gap-3 lg:hidden">
              <Skeleton className="h-13 w-40 rounded-none" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
      <Skeleton className="h-80 w-full rounded-none" />
    </div>
  );
}
