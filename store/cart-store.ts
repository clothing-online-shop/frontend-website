import { create } from "zustand";

// TODO: implement cart items/quantity/total in Sprint 3
type CartState = Record<string, never>;

export const useCartStore = create<CartState>()(() => ({}));
