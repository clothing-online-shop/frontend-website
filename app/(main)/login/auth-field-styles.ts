// Class dùng cho form Đăng nhập trong box (app/(main)/login) — tách riêng file để nếu sau
// này có mockup cho Đăng ký/OTP/Quên mật khẩu trong CÙNG box này thì dùng lại luôn, không
// lặp code.
//
// Font-size dùng thang custom `text-size-*` (định nghĩa ở app/globals.css, đơn vị px rõ
// ràng) thay cho thang mặc định của Tailwind (`text-xs`/`text-sm`/`text-base`...) để đồng bộ
// với phần còn lại của site — quy đổi 1-1 theo đúng px: text-xs=12→text-size-12,
// text-sm=14→text-size-14, text-base=16→text-size-16.
export const AUTH_LABEL_CLASS = "text-size-12 font-medium text-[#4C4741]";
export const AUTH_INPUT_CLASS = "h-[46px] mt-[2px]";
export const AUTH_SUBMIT_BUTTON_CLASS =
  "w-full text-size-16 font-bold h-[50px] uppercase text-[rgba(255,255,255,0.06)] bg-[rgba(30,26,21,1)]! mb-4 rounded-none";
export const AUTH_ERROR_BOX_CLASS = "rounded-lg bg-[#FFF0EE] px-4 py-3 h-[64px] text-size-14 text-destructive";
export const AUTH_LINK_CLASS = "text-[#8B5339] text-size-12";
