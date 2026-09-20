import Image from "next/image";

export function CategoryHero({
  title,
  description,
  total,
  imageUrl,
}: {
  title: string;
  description?: string | null;
  total?: number;
  imageUrl?: string | null;
}) {
  return (
    <div className="relative mb-8 min-h-45 overflow-hidden bg-secondary px-6 py-10 sm:px-10">
      {imageUrl ? (
        <Image src={imageUrl} alt="" fill sizes="(min-width: 1024px) 1152px, 100vw" className="object-cover" />
      ) : null}
      <div className="relative">
        <h1 className="font-heading text-size-32 font-normal text-brand-10 sm:text-size-40">
          {title}
        </h1>
        {description ? <p className="mt-2 max-w-2xl text-sm text-neutral-3F3A34">{description}</p> : null}
        {total !== undefined ? (
          <p className="mt-2 text-sm text-neutral-3F3A34">{total} sản phẩm</p>
        ) : null}
      </div>
    </div>
  );
}
