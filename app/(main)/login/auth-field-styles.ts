// Các class dùng chung cho MỌI form trong box đăng nhập (Đăng nhập/Đăng ký/OTP/Quên mật
// khẩu) — tách ra đây để 4 form nhìn đồng nhất 1 ngôn ngữ thiết kế (font-size, font-weight,
// màu, border...) như yêu cầu, và sửa 1 chỗ là đổi được cho cả 4 thay vì lặp lại 4 nơi.
export const AUTH_LABEL_CLASS = "text-xs font-medium text-[#4C4741]";
export const AUTH_INPUT_CLASS = "h-[46px] mt-[6px]";
export const AUTH_SUBMIT_BUTTON_CLASS =
  "w-full text-base font-bold h-[50px] uppercase text-[rgba(255,255,255,0.06)] bg-[rgba(30,26,21,1)]! mb-4";
export const AUTH_SECONDARY_BUTTON_CLASS =
  "w-full text-base font-bold h-[50px] uppercase border-[#1E1A15] text-[#1E1A15]";
export const AUTH_ERROR_BOX_CLASS = "rounded-lg bg-[#FFF0EE] px-4 py-3 h-[64px] text-sm text-destructive";
export const AUTH_LINK_CLASS = "text-[#8B5339] text-xs";
