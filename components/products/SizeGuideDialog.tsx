import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Bảng số đo chung (cm) — không phải dữ liệu riêng từng sản phẩm, chỉ để khách tham khảo
// nhanh trước khi chọn size, giống các shop thời trang khác đang làm.
const SIZE_GUIDE_ROWS = [
  { size: "S", chest: "84–88", waist: "64–68", length: "66" },
  { size: "M", chest: "88–92", waist: "68–72", length: "68" },
  { size: "L", chest: "92–96", waist: "72–76", length: "70" },
  { size: "XL", chest: "96–100", waist: "76–80", length: "72" },
  { size: "XXL", chest: "100–104", waist: "80–84", length: "74" },
];

export function SizeGuideDialog() {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <button
            type="button"
            className="cursor-pointer font-medium text-size-14 text-xs text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
          />
        }
      >
        Hướng dẫn chọn size
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Hướng dẫn chọn size</DialogTitle>
        </DialogHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-2 pr-2 font-medium">Size</th>
                <th className="py-2 pr-2 font-medium">Ngực (cm)</th>
                <th className="py-2 pr-2 font-medium">Eo (cm)</th>
                <th className="py-2 font-medium">Dài áo (cm)</th>
              </tr>
            </thead>
            <tbody>
              {SIZE_GUIDE_ROWS.map((row) => (
                <tr key={row.size} className="border-b border-border last:border-0">
                  <td className="py-2 pr-2 font-medium">{row.size}</td>
                  <td className="py-2 pr-2">{row.chest}</td>
                  <td className="py-2 pr-2">{row.waist}</td>
                  <td className="py-2">{row.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground">
          Số đo mang tính tham khảo, có thể chênh lệch 1–2cm tùy sản phẩm.
        </p>
      </DialogContent>
    </Dialog>
  );
}
