import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "@/components/layout/SocialIcons";
import { NewsletterForm } from "@/components/home/NewsletterForm";

const POLICY_LINKS = [
  { label: "Chính sách đổi trả", href: "#" },
  { label: "Chính sách vận chuyển", href: "#" },
  { label: "Chính sách bảo mật", href: "#" },
  { label: "Điều khoản sử dụng", href: "#" },
];

const SOCIAL_LINKS = [
  { label: "Facebook", href: "#", icon: FacebookIcon },
  { label: "Instagram", href: "#", icon: InstagramIcon },
  { label: "Youtube", href: "#", icon: YoutubeIcon },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <Logo className="text-base" />
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 size-4 shrink-0" />
                <a href="tel:19001234" className="hover:text-foreground">
                  1900 1234
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 size-4 shrink-0" />
                <a href="mailto:hotro@clothingshop.vn" className="hover:text-foreground">
                  hotro@clothingshop.vn
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                <span>Số 1 Đường ABC, Quận 1, TP. Hồ Chí Minh</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-heading text-sm font-bold uppercase">Chính sách</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {POLICY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-heading text-sm font-bold uppercase">Kết nối với chúng tôi</h3>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <social.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-heading text-sm font-bold uppercase">Đăng ký nhận bản tin</h3>
            <p className="mb-3 text-sm text-muted-foreground">
              Nhận thông tin ưu đãi và bộ sưu tập mới sớm nhất.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Clothing Shop. All rights reserved.</p>
          <div className="flex items-center gap-2">
            {/* Placeholder logo "Đã đăng ký Bộ Công Thương" — cần thay bằng ảnh + link xác nhận thật khi có */}
            <span className="rounded-sm border border-border px-2 py-1">
              Đã đăng ký Bộ Công Thương
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
