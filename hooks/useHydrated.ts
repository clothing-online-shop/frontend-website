"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// false ở server VÀ suốt lần render hydrate đầu tiên, true từ lần render kế tiếp trở đi. Dùng để
// chỉ hiện phần UI phụ thuộc dữ liệu client-only (React Query cache dùng chung, localStorage...)
// SAU khi hydrate xong — React hydrate từng Suspense boundary độc lập, nên 1 query đã được nơi
// khác (vd header) nạp xong trước khi boundary của trang hydrate sẽ khiến client render ra khác
// HTML server ("Hydration failed"). Không dùng useEffect+setState vì bị lint react-hooks chặn.
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
