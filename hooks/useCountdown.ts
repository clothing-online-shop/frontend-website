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
  const [remaining, setRemaining] = useState(() => getRemaining(endsAt));

  useEffect(() => {
    const timer = setInterval(() => setRemaining(getRemaining(endsAt)), 1000);
    return () => clearInterval(timer);
  }, [endsAt]);

  return { ...remaining, isOver: remaining.diff <= 0 };
}
