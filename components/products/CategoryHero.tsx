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
        <>
          <Image src={imageUrl} alt="" fill sizes="(min-width: 1024px) 1152px, 100vw" className="object-cover" />
          {/* Gradient thay vì phủ đều toàn ảnh — đậm ở khu vực có chữ (bên trái) để luôn đủ
              tương phản, nhạt dần sang phải để vẫn thấy rõ ảnh thay vì mờ hết cả banner. */}
          <div className="absolute inset-0 bg-gradient-to-r from-secondary from-10% via-secondary/70 via-40% to-transparent to-75%" />
        </>
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
