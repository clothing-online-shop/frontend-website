const GUEST_ID_KEY = "clothing-shop-guest-id";

export function getGuestId(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const existing = window.localStorage.getItem(GUEST_ID_KEY);
    if (existing) return existing;

    const generated = crypto.randomUUID();
    window.localStorage.setItem(GUEST_ID_KEY, generated);
    return generated;
  } catch {
    return null;
  }
}
