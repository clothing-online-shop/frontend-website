// Types replicated locally from the response shapes of backend-user (xem
// backend-user/src/modules/{auth,categories,products}). Trước đây các type này nằm ở
// package dùng chung @clothing-shop/shared-types (đã bị xóa khi tách 2 backend độc lập).

export enum ProductStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export type ProductSort = "price_asc" | "price_desc" | "newest" | "best_selling";

export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface AuthUser {
  id: string;
  email: string;
  phone: string | null;
  fullName: string;
  // toSafeUser() (backend-user) chỉ loại field password, còn lại trả nguyên model User —
  // trước đây type này thiếu 4 field dưới đây dù backend đã trả về, khiến trang tài khoản
  // không đọc được ngày sinh/giới tính/avatar thật của user.
  dateOfBirth: string | null;
  gender: Gender | null;
  avatarUrl: string | null;
  avatarPublicId: string | null;
  role: "CUSTOMER" | "ADMIN";
  status: "ACTIVE" | "INACTIVE" | "BANNED";
  emailVerifiedAt: string | null;
  phoneVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface VerifyOtpPayload {
  email: string;
  code: string;
}

export interface ResendOtpPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface LogoutPayload {
  refreshToken: string;
}

export interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  isActive: boolean;
  sortOrder: number;
  parentId: string | null;
  // Tổng số sản phẩm ACTIVE của danh mục này cộng dồn cả nhánh con (xem
  // backend-user/src/modules/categories/categories.service.ts).
  productCount: number;
  createdAt: string;
  updatedAt: string;
  children: CategoryNode[];
}

export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  thumbnail: string | null;
  brandName: string | null;
  basePrice: number;
  salePrice: number | null;
  status: ProductStatus;
  categoryId: string;
  totalStock: number;
  colors: string[];
  sizes: string[];
  createdAt: string;
}

export interface Brand {
  id: string;
  name: string;
  productCount: number;
}

export interface RecentlyViewedItem {
  id: string;
  productId: string;
  viewedAt: string;
  product: {
    id: string;
    name: string;
    slug: string;
    thumbnail: string | null;
    basePrice: number;
    salePrice: number | null;
    status: ProductStatus;
  };
}

export interface WishlistItem {
  id: string;
  productId: string;
  createdAt: string;
  product: {
    id: string;
    name: string;
    slug: string;
    thumbnail: string | null;
    basePrice: number;
    salePrice: number | null;
    status: ProductStatus;
  };
}

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  sku: string;
  price: number;
  stockQuantity: number;
  imageUrl: string | null;
}

export interface ProductReview {
  id: string;
  productId: string;
  // Tên đã được BE ẩn danh một phần (vd "Mai N.") — không phải fullName thật, xem
  // backend-user/src/modules/products/products.service.ts (maskReviewerName).
  reviewerName: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export interface ReviewSummary {
  average: number;
  count: number;
  breakdown: Record<number, number>;
}

export interface ProductDetail extends ProductListItem {
  description: string | null;
  material: string | null;
  careInstructions: string | null;
  images: string[];
  category: {
    id: string;
    name: string;
    slug: string;
    ancestors: { id: string; name: string; slug: string }[];
  };
  variants: ProductVariant[];
  reviews: ProductReview[];
  reviewSummary: ReviewSummary;
  soldCount: number;
  relatedProducts: ProductListItem[];
}

export type OrderStatus = "PENDING" | "CONFIRMED" | "SHIPPING" | "COMPLETED" | "CANCELLED";
export type PaymentStatus = "UNPAID" | "PAID" | "REFUNDED" | "FAILED";
export type CheckoutPaymentMethod = "COD" | "VNPAY" | "MOMO" | "STRIPE" | "BANK_TRANSFER";

export interface OrderItem {
  id: string;
  productVariantId: string;
  productName: string;
  variantSku: string;
  size: string;
  color: string;
  thumbnail: string | null;
  quantity: number;
  priceAtPurchase: number;
}

export interface Order {
  id: string;
  userId: string;
  orderCode: string;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface CreateOrderPayload {
  addressId: string;
  cartItemIds: string[];
  paymentMethod: CheckoutPaymentMethod;
}

export interface InitiateVnpayResponse {
  paymentUrl: string;
}

export interface VerifyVnpayReturnResponse {
  success: boolean;
  orderId: string | null;
  orderCode: string;
  message: string;
}

export interface BankTransferInfo {
  bankAccountNumber: string;
  bankAccountName: string;
  bankName: string;
  transferContent: string;
  amount: number;
}

export interface HeroBanner {
  id: string;
  eyebrow: string | null;
  title: string;
  description: string | null;
  imageUrl: string;
  linkUrl: string | null;
  ctaLabel: string | null;
  ctaLinkUrl: string | null;
  sortOrder: number;
}

export interface ActivePromoBar {
  id: string;
  label: string;
  highlight: string;
  linkUrl: string;
  startDate: string;
  endDate: string;
}

export interface ActivePopup {
  id: string;
  eyebrow: string | null;
  title: string;
  description: string | null;
  discountCode: string | null;
  imageUrl: string;
  ctaLabel: string;
  ctaLinkUrl: string;
}

export interface ActiveFlashSaleProduct {
  id: string;
  name: string;
  slug: string;
  thumbnail: string | null;
  basePrice: number;
  salePrice: number;
  soldPercent: number;
  colors: string[];
}

export interface ActiveFlashSale {
  id: string;
  name: string;
  endDate: string;
  products: ActiveFlashSaleProduct[];
}

export interface BlogPostSummary {
  id: string;
  title: string;
  slug: string;
  coverImage: string | null;
  createdAt: string;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
