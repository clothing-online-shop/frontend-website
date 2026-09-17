import Image from "next/image";
import Link from "next/link";
import type { ActiveCollection } from "@/lib/shared-types";

const COLLECTION_FALLBACK_IMAGE = (slug: string) => `https://picsum.photos/seed/${slug}/1400/680`;

export function CollectionPromo({ collection }: { collection: ActiveCollection | null }) {
  if (!collection) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col border border-border sm:flex-row">
        <div className="relative aspect-[1400/680] w-full sm:w-[60%]">
          <Image
            src={collection.imageUrl ?? COLLECTION_FALLBACK_IMAGE(collection.slug)}
            alt={collection.name}
            fill
            sizes="(min-width: 640px) 60vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center gap-3 p-8 sm:w-[40%] sm:p-12 bg-white">
          <p className="text-xs font-semibold tracking-wide text-primary uppercase">Bộ sưu tập</p>
          <h2 className="font-heading text-size-30 leading-[34.5px] font-normal text-foreground">
            {collection.name} — {collection.productCount} mẫu
          </h2>
          {collection.description && (
            <p className="text-sm leading-[22px] text-neutral-33">{collection.description}</p>
          )}
          <Link
            href={`/bo-suu-tap/${collection.slug}`}
            className="mt-1 w-fit text-sm font-semibold text-foreground underline underline-offset-4 hover:text-primary"
          >
            Xem bộ sưu tập →
          </Link>
        </div>
      </div>
    </section>
  );
}
