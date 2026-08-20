import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Header lấy cây danh mục thật ở mọi trang trong nhóm (main) — nếu để static mặc định,
// menu bị đóng băng theo kết quả lúc build (kể cả rỗng nếu build chạy trước khi backend
// sẵn sàng). Revalidate định kỳ thay vì force-dynamic để vẫn tận dụng cache.
export const revalidate = 60;

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
