import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { NewsletterForm } from "@/components/home/NewsletterForm";

const SHOP_LINKS = [
  { label: "Sản phẩm mới", href: "/san-pham?sort=newest" },
  // Chưa có trang riêng cho bộ sưu tập/thương hiệu — giữ chỗ theo design, nối link thật khi có trang.
  { label: "Bộ sưu tập", href: "#" },
  { label: "Thương hiệu", href: "#" },
  { label: "Flash Sale", href: "/#flash-sale" },
];

const POLICY_LINKS = [
  { label: "Điều khoản sử dụng", href: "#" },
  { label: "Chính sách bảo mật", href: "#" },
  { label: "Chính sách đổi trả", href: "#" },
  { label: "Chính sách vận chuyển", href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-brand-7 text-neutral-84">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <Logo className="text-lg text-white" />
            <ul className="space-y-1.5 text-sm">
              <li>
                Hotline{" "}
                <a href="tel:19006868" className="hover:text-white">
                  1900 6868
                </a>
              </li>
              <li>
                <a href="mailto:cskh@phuongphuong.vn" className="hover:text-white">
                  cskh@phuongphuong.vn
                </a>
              </li>
              <li>Số 8 Tràng Thi, Hoàn Kiếm, Hà Nội</li>
            </ul>
            {/* Placeholder logo "Đã đăng ký Bộ Công Thương" — cần thay bằng ảnh + link xác nhận thật khi có */}
            <p className="pt-2 text-xs text-neutral-84/50">Logo Bộ Công Thương 200x76</p>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-bold tracking-wide text-white uppercase">Mua sắm</h3>
            <ul className="space-y-2 text-sm">
              {SHOP_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-bold tracking-wide text-white uppercase">Chính sách</h3>
            <ul className="space-y-2 text-sm">
              {POLICY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-1 text-xs font-bold tracking-wide text-white uppercase">Nhận bản tin</h3>
            <p className="mb-3 text-sm">Mẫu mới và ưu đãi, 2 email mỗi tháng.</p>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs sm:flex-row">
          <p>© {new Date().getFullYear()} Phương Phương</p>
          <Link href="#" className="hover:text-white">
            Liên hệ
          </Link>
          <p>Thanh toán: COD · Chuyển khoản · VNPay</p>
        </div>
      </div>
    </footer>
  );
}
