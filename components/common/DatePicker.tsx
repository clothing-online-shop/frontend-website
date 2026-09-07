"use client";

import { useEffect, useRef, useState } from "react";
import { format, parse, isValid } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  // ISO "yyyy-MM-dd" — khớp đúng định dạng input[type=date] cũ / DTO ngày sinh hiện có, rỗng
  // hoặc undefined = chưa chọn. Nhờ vậy cắm thẳng vào chỗ đang dùng <input type="date"> mà
  // không cần đổi kiểu dữ liệu xung quanh (react-hook-form field, payload gửi BE...).
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  maxDate?: Date;
  minDate?: Date;
  id?: string;
  className?: string;
  "aria-label"?: string;
  // "calendar" (mặc định): chỉ bấm chọn qua lịch, không gõ được (tránh gõ sai định dạng ở
  // những chỗ không cần gõ nhanh). "text": cho gõ tay thẳng "dd/mm/yyyy" (tự chèn "/" ngay
  // khi đủ 2 số ngày/tháng, xoá lùi không bị kẹt ở dấu "/") — hợp cho field người dùng luôn
  // nhớ sẵn ngày (vd ngày sinh), gõ tay nhanh hơn hẳn bấm chọn qua vài chục năm trên lịch.
  // Icon lịch vẫn giữ ở cả 2 kiểu để bấm chọn qua Calendar nếu muốn, không bắt buộc phải gõ.
  type?: "calendar" | "text";
}

const DISPLAY_FORMAT = "dd/MM/yyyy";
const ISO_FORMAT = "yyyy-MM-dd";

function isoToDisplay(iso: string | undefined): string {
  if (!iso) return "";
  const parsed = parse(iso, ISO_FORMAT, new Date());
  return isValid(parsed) ? format(parsed, DISPLAY_FORMAT) : "";
}

// Ghép lại "dd/MM/yyyy" từ chuỗi số thô, tự chèn "/" ngay khi đủ 2 số 1 nhóm — vd digits="20"
// -> "20/", digits="2003" -> "20/03/". Dùng chung cho mọi bước gõ (kể cả sau khi xoá), nên
// không cần theo dõi vị trí con trỏ thủ công.
function formatMaskedDigits(digits: string): string {
  const d = digits.slice(0, 8);
  let out = d.slice(0, 2);
  if (d.length >= 2) out += "/";
  out += d.slice(2, 4);
  if (d.length >= 4) out += "/";
  out += d.slice(4, 8);
  return out;
}

// Thay <input type="date"> mặc định của trình duyệt — mỗi OS/browser tự vẽ 1 kiểu khác
// nhau, xấu và lệch hẳn style chung của site. Dùng chung cho mọi màn cần chọn ngày (hiện
// đang dùng ở ProfileForm/Ngày sinh).
export function DatePicker({
  value,
  onChange,
  placeholder = "Chọn ngày",
  disabled,
  maxDate,
  minDate,
  id,
  className,
  type = "calendar",
  ...rest
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const parsedValue = value ? parse(value, ISO_FORMAT, new Date()) : undefined;
  const selected = parsedValue && isValid(parsedValue) ? parsedValue : undefined;

  const calendar = (
    <Calendar
      mode="single"
      locale={vi}
      // Bỏ captionLayout="dropdown" (chọn tháng/năm qua dropdown) — type="text" (gõ tay
      // "dd/mm/yyyy") đã giải quyết đúng nhu cầu nhảy xa năm (vd sinh 2003) tốt hơn, dropdown
      // hoá ra thừa/rối. Giữ nguyên startMonth/endMonth để giới hạn phạm vi mũi tên lùi/tiến
      // theo minDate/maxDate (nếu có), không liên quan gì đến chuyện có dropdown hay không.
      startMonth={minDate}
      endMonth={maxDate}
      selected={selected}
      defaultMonth={selected ?? maxDate}
      disabled={(date) => (maxDate ? date > maxDate : false) || (minDate ? date < minDate : false)}
      onSelect={(date) => {
        if (!date) return;
        onChange(format(date, ISO_FORMAT));
        setOpen(false);
      }}
      classNames={{ root: "w-full" }}
      // Mặc định react-day-picker ghi tên tháng đầy đủ theo locale ("Tháng Chín") — muốn
      // hiện số ("Tháng 9") thì phải tự override formatCaption (formatter riêng cho
      // captionLayout="label" — dropdown dùng formatMonthDropdown, không áp dụng nữa).
      formatters={{ formatCaption: (date) => format(date, "'Tháng' M yyyy") }}
    />
  );

  if (type === "text") {
    return (
      <TypableDatePicker
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        maxDate={maxDate}
        minDate={minDate}
        id={id}
        className={className}
        open={open}
        onOpenChange={setOpen}
        calendar={calendar}
        {...rest}
      />
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            type="button"
            id={id}
            disabled={disabled}
            className={cn(
              "flex h-8 w-full min-w-0 items-center justify-between gap-2 rounded-none border border-[#E0DDDA] bg-transparent px-2.5 py-1 text-base text-left transition-colors outline-none focus-visible:border-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm",
              !selected && "text-muted-foreground",
              className,
            )}
            {...rest}
          />
        }
      >
        <span className="truncate">{isoToDisplay(value) || placeholder}</span>
        <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
      </PopoverTrigger>
      {/* w-(--anchor-width): base-ui tự expose độ rộng trigger qua biến CSS này (giống cách
          select.tsx trong dự án đang làm) — lịch tự khớp đúng độ rộng ô input bên trên thay
          vì w-auto co theo nội dung lịch, nhìn lệch/không liên kết với input phía trên. */}
      <PopoverContent align="start" className="w-(--anchor-width) min-w-70 p-0">
        {calendar}
      </PopoverContent>
    </Popover>
  );
}

interface TypableDatePickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  maxDate?: Date;
  minDate?: Date;
  id?: string;
  className?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  calendar: React.ReactNode;
}

function TypableDatePicker({
  value,
  onChange,
  placeholder,
  disabled,
  maxDate,
  minDate,
  id,
  className,
  open,
  onOpenChange,
  calendar,
  ...rest
}: TypableDatePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState(() => isoToDisplay(value));

  // Chỉ đồng bộ lại từ value khi input KHÔNG đang được gõ dở (tránh ghi đè chữ đang gõ giữa
  // chừng) — value đổi từ bên ngoài (bấm chọn qua lịch, hoặc reset form) mới cần sync vào
  // đây; đang gõ tay thì text tự quản lý riêng, chỉ "chốt" lên onChange khi đủ 8 số hợp lệ.
  useEffect(() => {
    if (document.activeElement !== inputRef.current) {
      setText(isoToDisplay(value));
    }
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    const isDeleting = raw.length < text.length;
    let digits = raw.replace(/\D/g, "").slice(0, 8);

    if (isDeleting) {
      const prevDigits = text.replace(/\D/g, "");
      // Số lượng chữ số không đổi nghĩa là ký tự vừa xoá là dấu "/" tự chèn (không phải số)
      // — formatMaskedDigits sẽ chèn "/" lại y hệt, nhìn như bấm Xoá không có tác dụng gì.
      // Xoá thêm 1 số nữa để mỗi lần bấm Xoá đều thấy tiến triển thật.
      if (digits.length === prevDigits.length && digits.length > 0) {
        digits = digits.slice(0, -1);
      }
    }

    const masked = formatMaskedDigits(digits);
    setText(masked);

    if (digits.length === 0) {
      onChange("");
      return;
    }
    if (digits.length < 8) {
      // Chưa gõ xong — chưa chốt giá trị lên form, nhưng vẫn hiện đúng những gì đang gõ dở.
      return;
    }
    const parsed = parse(masked, DISPLAY_FORMAT, new Date());
    // So khớp lại chuỗi format ngược để bắt các ngày tràn lịch kiểu "31/02" (JS Date tự lăn
    // sang tháng 3 nên isValid() một mình không phát hiện được), đồng thời chặn luôn theo
    // maxDate/minDate — không thì gõ tay sẽ nhập được ngày tương lai dù bấm chọn qua lịch
    // bên cạnh đã disable/xám các ngày đó, 2 kiểu nhập không nhất quán với nhau. Không hợp
    // lệ thì không chốt, giữ nguyên text đang gõ để người dùng tự sửa.
    const inRange = (!maxDate || parsed <= maxDate) && (!minDate || parsed >= minDate);
    if (isValid(parsed) && format(parsed, DISPLAY_FORMAT) === masked && inRange) {
      onChange(format(parsed, ISO_FORMAT));
    }
  }

  return (
    <div
      ref={wrapperRef}
      className={cn(
        "flex h-8 w-full min-w-0 items-center gap-2 rounded-none border border-[#E0DDDA] bg-transparent pr-2.5 transition-colors focus-within:border-ring has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:bg-input/50 has-disabled:opacity-50",
        className,
      )}
    >
      <input
        ref={inputRef}
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder={placeholder ?? DISPLAY_FORMAT.toLowerCase()}
        disabled={disabled}
        value={text}
        onChange={handleChange}
        className="h-full min-w-0 flex-1 bg-transparent px-2.5 py-1 text-base outline-none placeholder:text-muted-foreground md:text-sm"
        {...rest}
      />
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger
          render={
            <button
              type="button"
              disabled={disabled}
              aria-label="Chọn ngày qua lịch"
              className="shrink-0 cursor-pointer text-muted-foreground hover:text-foreground disabled:pointer-events-none"
            />
          }
        >
          <CalendarIcon className="size-4" />
        </PopoverTrigger>
        {/* anchor=wrapperRef: neo theo cả khung ngoài (input+icon), không phải theo icon
            (rất hẹp) — trước đó lệch/tràn ra ngoài vì popover tự lấy icon nhỏ xíu làm mốc,
            rồi align="end" kéo ngược cả khối lịch rộng ra bên trái, lấn qua cột khác. */}
        <PopoverContent anchor={wrapperRef} align="start" className="w-(--anchor-width) min-w-70 p-0">
          {calendar}
        </PopoverContent>
      </Popover>
    </div>
  );
}
