import Image from "next/image";
import type { BlogPostSummary } from "@/lib/shared-types";
import { formatDate } from "@/lib/format";

export function BlogSection({ posts }: { posts: BlogPostSummary[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {posts.map((post) => (
          <article key={post.id}>
            <div className="relative aspect-[4/2.2] overflow-hidden bg-secondary">
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
            <div className="p-4 bg-white min-h-[130px]">
              <p className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</p>
              <h3 className="mt-1 line-clamp-2 text-size-22 font-medium text-foreground">{post.title}</h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
