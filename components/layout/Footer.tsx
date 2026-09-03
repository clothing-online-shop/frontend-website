import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "@/components/layout/SocialIcons";
import { NewsletterForm } from "@/components/home/NewsletterForm";

// "Sản phẩm mới" trỏ /san-pham?sort=newest (trang thật, đã có) — "Flash Sale" trỏ thẳng tới
// section cùng tên ở trang chủ (xem id="flash-sale" ở FlashSaleSection.tsx). 2 mục còn lại
// chưa có trang riêng (không có route /bo-suu-tap, /thuong-hieu) nên để "#" giống cách
// POLICY_LINKS bên dưới đã làm với các trang chính sách chưa có nội dung thật.
const SHOP_LINKS = [
  { label: "Sản phẩm mới", href: "/san-pham?sort=newest" },
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

const SOCIAL_LINKS = [
  { label: "Facebook", href: "#", icon: FacebookIcon },
  { label: "Instagram", href: "#", icon: InstagramIcon },
  { label: "Youtube", href: "#", icon: YoutubeIcon },
];

export function Footer() {
  return (
    // Nền tối = màu foreground của trang (đảo ngược có chủ đích), chữ = màu background —
    // dùng lại đúng 2 token màu hệ thống thay vì bịa màu mới, xem Logo.tsx.
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <Logo className="text-background text-size-26" />
            <ul className="space-y-2 text-sm text-background/70">
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 size-4 shrink-0" />
                <a href="tel:19006868" className="hover:text-background">
                  1900 6868
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 size-4 shrink-0" />
                <a href="mailto:cskh@phuongphuong.vn" className="hover:text-background">
                  cskh@phuongphuong.vn
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                <span>Số 8 Tràng Thi, Hoàn Kiếm, Hà Nội</span>
              </li>
            </ul>
            {/* Placeholder logo "Đã thông báo Bộ Công Thương" — cần thay bằng ảnh + link
                xác nhận thật khi có, giữ đúng kích thước gợi ý trong chữ để người thay ảnh
                sau biết kích thước cần dùng. */}
            <p className="pt-1 text-[11px] tracking-wide text-background/40 uppercase">
              Logo Bộ Công Thương 200x76
            </p>
          </div>

          <div>
            <h3 className="mb-3 font-heading text-sm font-bold text-background uppercase">
              Mua sắm
            </h3>
            <ul className="space-y-2 text-sm text-background/70">
              {SHOP_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-background">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-heading text-sm font-bold text-background uppercase">
              Chính sách
            </h3>
            <ul className="space-y-2 text-sm text-background/70">
              {POLICY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-background">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-heading text-sm font-bold text-background uppercase">
              Nhận bản tin
            </h3>
            <p className="mb-3 text-sm text-background/70">
              Mẫu mới và ưu đãi, 2 email mỗi tháng.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-background/15 pt-6 text-size-14 text-background/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Phương Phương</p>

          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-background">
              Liên hệ
            </Link>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex size-7 items-center justify-center rounded-full border border-background/25 text-background/70 transition-colors hover:border-background hover:text-background"
                >
                  <social.icon className="size-3.5" />
                </a>
              ))}
            </div>
          </div>

          <p>Thanh toán: COD · Chuyển khoản · VNPay</p>
        </div>
      </div>
    </footer>
  );
}
