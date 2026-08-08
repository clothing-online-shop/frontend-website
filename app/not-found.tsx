import { Logo } from "@/components/layout/Logo";
import { StatusPage } from "@/components/errors/StatusPage";

export default function NotFound() {
  return (
    <div>
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-4">
          <Logo className="text-lg" />
        </div>
      </header>

      <StatusPage
        code="404"
        title="Không tìm thấy trang"
        description="Trang bạn tìm không tồn tại hoặc đã bị xoá. Thử tìm sản phẩm bên dưới hoặc quay về trang chủ."
      />
    </div>
  );
}
