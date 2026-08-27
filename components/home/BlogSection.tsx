import Image from "next/image";
import type { BlogPostSummary } from "@/lib/shared-types";
import { formatDate } from "@/lib/format";

export function BlogSection({ posts }: { posts: BlogPostSummary[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <h2 className="mb-6 font-heading text-2xl font-extrabold uppercase">Góc tư vấn</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {posts.map((post) => (
          <article key={post.id}>
            <div className="relative aspect-4/3 overflow-hidden bg-secondary">
              {post.coverImage && (
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover"
                />
              )}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{formatDate(post.createdAt)}</p>
            <h3 className="mt-1 line-clamp-2 text-sm font-medium text-foreground">{post.title}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}
