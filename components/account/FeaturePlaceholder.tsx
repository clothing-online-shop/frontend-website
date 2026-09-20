// Nội dung tạm cho các mục menu tài khoản chưa có tính năng thật (địa chỉ, đổi trả, điểm thành viên,
// thông báo...) — mỗi mục có 1 route/page riêng để sau này chỉ việc thay component này bằng nội dung thật.
// Tiêu đề dùng đúng style h1 của các trang tài khoản đã làm (Đơn hàng, Sản phẩm yêu thích).
export function FeaturePlaceholder({ title }: { title: string }) {
  return (
    <div>
      <h1 className="font-heading text-size-24 font-normal text-brand-10 sm:text-size-28">{title}</h1>
      <div className="flex min-h-80 items-center justify-center text-center">
        <p className="text-size-16 text-muted-foreground">Tính năng chờ phát triển</p>
      </div>
    </div>
  );
}
