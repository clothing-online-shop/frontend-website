import Link from "next/link";

const NAV_ITEMS = [
  { href: "/products", label: "Sản phẩm" },
  { href: "/cart", label: "Giỏ hàng" },
  { href: "/account", label: "Tài khoản" },
];

export function Header() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-heading text-xl font-semibold tracking-wide uppercase">
          Clothing Shop
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-foreground/80 transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
