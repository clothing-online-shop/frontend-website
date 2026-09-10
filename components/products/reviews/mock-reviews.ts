import type { ProductReview, ReviewSummary } from "@/lib/shared-types";

// Sản phẩm seed hiện chưa có review thật nào (reviewSummary.count luôn = 0) nên
// ReviewSection ẩn hẳn, trang chi tiết trông trống — theo yêu cầu người dùng, khi SẢN PHẨM
// CHƯA CÓ REVIEW THẬT thì thay bằng 1 tập con random (nhưng cố định theo từng sản phẩm, không
// đổi mỗi lần render) rút từ 10 mẫu dưới đây. Có review thật thì luôn ưu tiên review thật,
// không bao giờ trộn thật + giả (giữ đúng nguyên tắc reviewSummary phải khớp danh sách hiển
// thị, xem comment ở lib/shared-types.ts).
interface MockReviewSeed {
  reviewerName: string;
  rating: number;
  comment: string;
  variantLabel: string;
  daysAgo: number;
}

const MOCK_REVIEW_POOL: MockReviewSeed[] = [
  {
    reviewerName: "Mai N.",
    rating: 5,
    comment:
      "Vải mát, đứng dáng, tay bồng vừa phải không bị phồng quá. Cao 1m62 nặng 52kg mặc size M rộng nhẹ, đúng như mô tả.",
    variantLabel: "Size M · màu kem",
    daysAgo: 12,
  },
  {
    reviewerName: "Thu H.",
    rating: 4,
    comment: "Màu thật nhạt hơn ảnh một chút. Chất vải và đường may thì tốt hơn mong đợi ở mức giá này.",
    variantLabel: "Size S · màu xanh khói",
    daysAgo: 15,
  },
  {
    reviewerName: "Linh P.",
    rating: 5,
    comment: "Đổi size một lần, shop xử lý trong hai ngày. Sẽ mua thêm màu khác.",
    variantLabel: "Size L · màu nâu đất",
    daysAgo: 21,
  },
  {
    reviewerName: "Hương T.",
    rating: 5,
    comment: "Form chuẩn, mặc đi làm lẫn đi chơi đều hợp. Giặt máy vài lần vẫn chưa thấy bai form.",
    variantLabel: "Size M · màu đen",
    daysAgo: 6,
  },
  {
    reviewerName: "Quỳnh A.",
    rating: 4,
    comment: "Vải hơi mỏng so với hình dung ban đầu nhưng bù lại thoáng mát, giao hàng nhanh.",
    variantLabel: "Size S · màu trắng",
    daysAgo: 27,
  },
  {
    reviewerName: "Ngọc D.",
    rating: 3,
    comment: "Đường chỉ ở tay áo hơi lỏng, còn lại ổn. Nên căn size lớn hơn bình thường 1 size.",
    variantLabel: "Size L · màu xám",
    daysAgo: 33,
  },
  {
    reviewerName: "Phương L.",
    rating: 5,
    comment: "Y hình, đóng gói cẩn thận. Đây là lần thứ 3 mua ở shop rồi, chưa lần nào thất vọng.",
    variantLabel: "Size M · màu be",
    daysAgo: 9,
  },
  {
    reviewerName: "Trang V.",
    rating: 4,
    comment: "Chất liệu ổn, hơi nhăn sau khi giặt nhưng ủi lại là hết. Giá hợp lý.",
    variantLabel: "Size S · màu kem",
    daysAgo: 18,
  },
  {
    reviewerName: "Yến K.",
    rating: 5,
    comment: "Mặc rất thoải mái, không bí. Nhân viên tư vấn size nhiệt tình qua chat.",
    variantLabel: "Size L · màu đen",
    daysAgo: 40,
  },
  {
    reviewerName: "Bảo C.",
    rating: 4,
    comment: "Sản phẩm đúng mô tả, thời gian giao hơi lâu do đúng dịp sale nhưng chất lượng bù lại được.",
    variantLabel: "Size M · màu xanh rêu",
    daysAgo: 24,
  },
];

// Hash chuỗi đơn giản (djb2) -> số nguyên dương, dùng làm seed cho PRNG bên dưới — cùng 1
// productId luôn ra cùng 1 seed, nên cùng 1 sản phẩm luôn hiện đúng 1 bộ review cố định qua
// các lần tải trang, khác sản phẩm thì seed khác nhau nên bộ review khác nhau.
function hashSeed(input: string): number {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return hash >>> 0;
}

// mulberry32 — PRNG nhỏ gọn, thuần theo seed số nguyên, đủ dùng để random-nhưng-tái-lập được
// (không cần chất lượng ngẫu nhiên mật mã học vì chỉ dùng để chọn/xáo review mẫu).
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildSummary(reviews: { rating: number }[]): ReviewSummary {
  const breakdown: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sum = 0;
  for (const { rating } of reviews) {
    breakdown[rating] = (breakdown[rating] ?? 0) + 1;
    sum += rating;
  }
  return {
    average: reviews.length > 0 ? Math.round((sum / reviews.length) * 10) / 10 : 0,
    count: reviews.length,
    breakdown,
  };
}

export function getMockReviewsForProduct(productId: string): {
  reviews: ProductReview[];
  summary: ReviewSummary;
} {
  const random = mulberry32(hashSeed(productId));

  // Fisher-Yates xáo mảng theo seed, rồi lấy ngẫu nhiên 4-7 review đầu — vừa khác nhau giữa
  // các sản phẩm (thứ tự lẫn số lượng), vừa không phải sản phẩm nào cũng hiện đủ 10 review y
  // hệt nhau trông giả.
  const shuffled = [...MOCK_REVIEW_POOL];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const count = 4 + Math.floor(random() * 4); // 4..7
  const picked = shuffled.slice(0, count);

  const now = Date.now();
  const reviews: ProductReview[] = picked
    .map((seed, index) => ({
      id: `mock-${productId}-${index}`,
      productId,
      reviewerName: seed.reviewerName,
      rating: seed.rating,
      comment: seed.comment,
      createdAt: new Date(now - seed.daysAgo * 24 * 60 * 60 * 1000).toISOString(),
      variantLabel: seed.variantLabel,
    }))
    // Mới nhất lên trước, khớp cách sắp xếp review thật thường thấy.
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  return { reviews, summary: buildSummary(picked) };
}
