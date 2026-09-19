"use client";

import { useEffect, useState } from "react";

function getRemaining(endsAt: number) {
  const diff = Math.max(0, endsAt - Date.now());
  return {
    diff,
    hours: Math.floor(diff / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  };
}

export function useCountdown(endsAt: number) {
  // Không được khởi tạo state bằng getRemaining(endsAt) ngay trong render — giá trị đó phụ
  // thuộc Date.now(), mà lần render trên server (SSR) và lần render hydrate đầu tiên trên
  // client luôn cách nhau ít nhất vài trăm ms (network + parse JS), nên số giây gần như chắc
  // chắn khác nhau -> React báo lỗi "Hydration failed... server rendered text didn't match
  // the client". Bắt đầu bằng null (giống hệt nhau ở cả 2 phía vì không phụ thuộc thời gian),
  // chỉ tính giá trị thật trong useEffect — effect chỉ chạy ở client SAU khi hydrate xong nên
  // không còn so sánh với HTML server nữa, không thể mismatch.
  const [remaining, setRemaining] = useState<ReturnType<typeof getRemaining> | null>(null);

  useEffect(() => {
    setRemaining(getRemaining(endsAt));
    const timer = setInterval(() => setRemaining(getRemaining(endsAt)), 1000);
    return () => clearInterval(timer);
  }, [endsAt]);

  if (!remaining) {
    // isOver cố định false ở pha này (không suy từ diff<=0) để tránh section ẩn rồi hiện lại
    // ngay sau khi mount — flash sale còn hạn hay không do BE đã lọc qua "active" từ trước.
    return { diff: 0, hours: 0, minutes: 0, seconds: 0, isOver: false };
  }
  return { ...remaining, isOver: remaining.diff <= 0 };
}
