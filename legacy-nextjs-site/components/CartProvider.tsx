'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { CartItem, Product } from '@/lib/types';

const STORAGE_KEY = 'saasycharms-cart';

type AppliedCoupon = { code: string; discountAmount: number };

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  total: number;
  appliedCoupon: AppliedCoupon | null;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: AppliedCoupon) => void;
  clearCoupon: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      // Hydrating client-only state from localStorage after mount avoids an
      // SSR/client markup mismatch — this must run once on mount, not derive
      // from props/state, so the usual "don't setState in an effect" advice
      // doesn't apply here.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // ignore corrupt/unavailable storage, start with an empty cart
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage unavailable (e.g. private browsing) — cart just won't persist
    }
  }, [items, hydrated]);

  function addItem(product: Product, quantity = 1) {
    setItems((current) => {
      const existing = current.find((item) => item.productId === product._id);
      if (existing) {
        return current.map((item) =>
          item.productId === product._id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...current,
        {
          productId: product._id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity,
        },
      ];
    });
  }

  function removeItem(productId: string) {
    setItems((current) => current.filter((item) => item.productId !== productId));
  }

  function updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((current) =>
      current.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
  }

  function clearCart() {
    setItems([]);
    setAppliedCoupon(null);
  }

  const count = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );
  const total = Math.max(0, subtotal - (appliedCoupon?.discountAmount ?? 0));

  return (
    <CartContext.Provider
      value={{
        items,
        count,
        subtotal,
        total,
        appliedCoupon,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        applyCoupon: setAppliedCoupon,
        clearCoupon: () => setAppliedCoupon(null),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
