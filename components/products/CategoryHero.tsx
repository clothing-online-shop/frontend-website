export function CategoryHero({ title, total }: { title: string; total?: number }) {
  return (
    <div className="mb-8 bg-secondary px-6 py-10 sm:px-10 min-h-[180px]">
      <h1 className="font-heading text-size-32 font-normal text-brand-10 sm:text-size-40">
        {title}
      </h1>
      {total !== undefined ? (
        <p className="mt-2 text-sm text-neutral-3F3A34">{total} sản phẩm</p>
      ) : null}
    </div>
  );
}
