@AGENTS.md

# Frontend Website (apps/web) — Quy tắc & Chuẩn code

Next.js App Router + TypeScript + Tailwind + shadcn/ui + React Query + Zustand. Trang khách hàng, ưu tiên SEO/SSR.

## Cấu trúc thư mục (bắt buộc theo mẫu)

```
app/
├── (main)/            # route group có Header/Footer: /, /products, /cart, /checkout, /account
├── (auth)/             # route group không có Header/Footer: /login, /register
├── layout.tsx          # root layout: html/body + Providers, KHÔNG đặt Header/Footer ở đây
└── providers.tsx        # QueryClientProvider
components/
├── layout/             # Header, Footer
└── ui/                 # shadcn component (sinh bằng CLI, không tự viết tay)
lib/                    # api-client.ts, <feature>-api.ts
store/                  # zustand store (auth-store.ts, cart-store.ts)
```

- Trang cần Header/Footer → đặt trong `app/(main)/...`. Trang không cần (login/register) → `app/(auth)/...`. Không thêm Header/Footer thủ công trong từng page.
- Thêm component UI mới từ shadcn: `npx shadcn@latest add <ten-component>`, không copy-paste code component từ nơi khác vào `components/ui/`.

## Server vs Client Component

- Mặc định viết Server Component (không có `"use client"`). Chỉ thêm `"use client"` khi cần state/effect/event handler/form (xem `app/(auth)/login/page.tsx`).
- Trang cần SEO động (chi tiết sản phẩm...) ưu tiên fetch data ở Server Component + `generateMetadata`, không fetch toàn bộ dữ liệu bằng client component rồi mất SEO.
- Route dùng `params`/`searchParams` ở Server Component đều là `Promise` (Next 16) — luôn `await params` (xem `products/[slug]/page.tsx`). Đọc kỹ `AGENTS.md`/`node_modules/next/dist/docs/` trước khi đổi cách dùng route props, vì bản Next này khác các bản trước.

## Gọi API

- Không gọi `axios`/`fetch` trực tiếp trong component. Tạo hàm trong `lib/<feature>-api.ts` (xem mẫu `lib/auth-api.ts`), dùng `apiClient` từ `lib/api-client.ts` (đã có interceptor tự gắn Bearer token + tự refresh khi 401).
- Data cần tương tác (mutation, cần loading/error state phía client) → dùng `@tanstack/react-query` (`useMutation`/`useQuery`) trong Client Component.

## State

- **Zustand** chỉ dùng cho state toàn cục thật sự cần (auth session, giỏ hàng). Không dùng để cache dữ liệu server — đó là việc của React Query hoặc Server Component fetch trực tiếp.
- Auth state qua `useAuthStore` (`store/auth-store.ts`, có `persist` vào localStorage) — không tự lưu token ở nơi khác.
- Store còn đang là khung (`cart-store.ts`) → khi triển khai thật (Sprint 3), giữ nguyên interface public đã dùng ở `lib/api-client.ts` nếu có phụ thuộc chéo.

## Form

- Dùng `react-hook-form` + `zod` (`zodResolver`) cho mọi form (xem `app/(auth)/login/page.tsx`, `register/page.tsx`). Không tự viết validate bằng `useState` + if/else rải rác.

## SEO (áp dụng từ Sprint 2 khi có data thật)

- Mỗi page hiển thị nội dung công khai (trang chủ, danh sách/chi tiết sản phẩm) phải có `export const metadata` hoặc `generateMetadata` — không để Next tự sinh title mặc định.
- Ảnh sản phẩm dùng `next/image`, không dùng thẻ `<img>` thường.

## Bắt đầu tính năng mới

- Trước khi code: `git checkout develop && git pull` để lấy code mới nhất, sau đó tạo branch mới từ `develop` với tên phù hợp tính năng đang làm (`feature/<mo-ta-ngan>`, `fix/<mo-ta-ngan>`) — không code thẳng trên `develop`.
- Sau khi code xong, trước khi báo hoàn thành/mở PR: chủ động tự review lại toàn bộ diff theo đúng quy ước trong `CLAUDE.md` này và `README.md` của repo — không chỉ dựa vào lint/build pass.

## Trước khi mở PR

1. `pnpm --filter @clothing-shop/web lint` — 0 lỗi.
2. `pnpm --filter @clothing-shop/web build` — build qua (bao gồm generate static pages, không có route bị lỗi type).
3. Test thủ công trên `pnpm --filter @clothing-shop/web dev`, kiểm tra cả responsive mobile trước khi báo hoàn thành.
