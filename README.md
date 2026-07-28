# frontend-website

Website bán hàng dành cho khách hàng của Clothing Shop, xây bằng Next.js (App Router). Gọi API trực tiếp tới **`backend-user`**. Đây là 1 trong 4 repo độc lập của hệ thống (không còn là monorepo/workspace chung):

| Repo | Vai trò | Port local |
|---|---|---|
| [backend-user](https://github.com/clothing-online-shop/backend-user) | API công khai cho khách hàng | `3001` |
| [backend-cms](https://github.com/clothing-online-shop/backend-cms) | API quản trị cho admin | `3002` |
| **frontend-website** (repo này) | Website bán hàng | `3000` |
| [frontend-admin](https://github.com/clothing-online-shop/frontend-admin) | Trang quản trị (Vite + React) | `5173` |

## Tech stack

- Next.js 16 (App Router, Turbopack) + TypeScript
- Tailwind CSS 4 + shadcn/ui
- TanStack React Query (data fetching/mutation phía client)
- Zustand (`persist` vào localStorage) cho auth session
- react-hook-form + zod cho validate form
- axios (`lib/api-client.ts`) — tự gắn Bearer token, tự refresh khi 401

> Lưu ý: đây là bản Next.js có breaking changes so với các bản trước (xem `AGENTS.md`) — đọc kỹ tài liệu trong `node_modules/next/dist/docs/` trước khi đổi cách dùng route props (`params`/`searchParams` là `Promise`, phải `await`).

## Cấu trúc thư mục

```
app/
├── (main)/            # route có Header/Footer: /, /products, /cart, /checkout, /account
├── (auth)/             # route không có Header/Footer: /login, /register
├── layout.tsx          # root layout (html/body + Providers)
└── providers.tsx        # QueryClientProvider
components/
├── layout/             # Header, Footer
├── products/           # ProductCard, ProductFilters, ProductGallery, ProductVariantPicker...
└── ui/                 # component shadcn (sinh bằng CLI, không tự viết tay)
lib/
├── api-client.ts        # axios instance dùng chung, interceptor auth
├── shared-types.ts       # type dùng chung cho response API (AuthUser, CategoryNode, ProductListItem...)
├── auth-api.ts, categories-api.ts, products-api.ts
└── format.ts, utils.ts
store/                  # zustand store (auth-store.ts, cart-store.ts)
```

## Yêu cầu môi trường

- Node.js 22+, `pnpm`
- `backend-user` phải đang chạy ở `http://localhost:3001` (xem README của `backend-user` để khởi động Postgres/Redis + API)

## Cài đặt & chạy local

```bash
# 1. Cài dependency (độc lập, không chạy từ thư mục cha)
pnpm install

# 2. Tạo .env.local từ mẫu
cp .env.example .env.local

# 3. Chạy dev server
pnpm dev
```

Mở `http://localhost:3000`.

## Biến môi trường

| Biến | Mô tả |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL của `backend-user` — mặc định `http://localhost:3001` |

## Trang hiện có

| Route | Nhóm | Mô tả |
|---|---|---|
| `/` | `(main)` | Trang chủ |
| `/products` | `(main)` | Danh sách sản phẩm (filter/sort/phân trang), fetch qua `ProductsPageClient` + React Query |
| `/products/[slug]` | `(main)` | Chi tiết sản phẩm — SSG, revalidate theo `generateStaticParams` |
| `/cart` | `(main)` | Giỏ hàng *(UI khung, chờ nối API `cart` thật từ backend-user)* |
| `/checkout` | `(main)` | Thanh toán *(UI khung, chờ nối API `orders`/`payments` thật)* |
| `/account` | `(main)` | Thông tin tài khoản |
| `/login`, `/register` | `(auth)` | Đăng nhập / đăng ký, dùng react-hook-form + zod |

## Auth & gọi API

- Không gọi `axios`/`fetch` trực tiếp trong component — luôn qua hàm trong `lib/<feature>-api.ts`, dùng chung `apiClient` (đã có interceptor tự gắn `Authorization: Bearer <token>` và tự refresh khi gặp 401).
- Session lưu trong `useAuthStore` (`store/auth-store.ts`), persist vào localStorage với key `clothing-shop-auth`.
- Trang cần SEO động ưu tiên fetch ở Server Component + `generateMetadata`; chỉ dùng `"use client"` khi cần state/effect/event handler/form.

## Scripts

| Lệnh | Mô tả |
|---|---|
| `pnpm dev` | Chạy dev server (Turbopack) |
| `pnpm build` | Build production, generate static pages |
| `pnpm start` | Chạy bản đã build |
| `pnpm lint` | ESLint |

## Trước khi mở PR

1. `pnpm lint` — 0 lỗi.
2. `pnpm build` — build qua, không route nào lỗi type/generate static page.
3. Test thủ công trên `pnpm dev`, kiểm tra cả responsive mobile.
