import { Minus, Plus } from "lucide-react";

export function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="group border-b border-border py-4 first:pt-0" open>
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-bold uppercase [&::-webkit-details-marker]:hidden">
        {title}
        <Plus className="size-4 text-muted-foreground group-open:hidden" />
        <Minus className="hidden size-4 text-muted-foreground group-open:block" />
      </summary>
      <div className="mt-3">{children}</div>
    </details>
  );
}
