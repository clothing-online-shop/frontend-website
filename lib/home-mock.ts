// picsum.photos/seed/<seed>/<w>/<h> trả cùng 1 ảnh cho cùng 1 seed (ổn định qua nhiều lần
// render, không random mỗi lần tải trang) — dùng làm ảnh fallback khi danh mục chưa có ảnh
// thật từ CMS. Trước đây dùng loremflickr.com (hay lỗi/chậm) — đã bỏ khỏi toàn bộ codebase.
export const FEATURED_CATEGORY_FALLBACK_IMAGE = (slug: string) => `https://picsum.photos/seed/${slug}/400/400`;
