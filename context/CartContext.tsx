"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { trackAddToCart } from "@/lib/facebook-pixel";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variantId?: string | null;
  variantLabel?: string | null;
}

function cartLineKey(item: CartItem): string {
  return `${item.productId}:${item.variantId ?? ""}`;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string, variantId?: string | null) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string | null) => void;
  clearCart: () => void;
  totalItems: number;
  totalDzd: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      const qty = item.quantity ?? 1;
      const line = { ...item, quantity: qty };
      trackAddToCart({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: qty,
      });
      setItems((prev) => {
        const key = cartLineKey(line);
        const existing = prev.find((i) => cartLineKey(i) === key);
        if (existing) {
          return prev.map((i) =>
            cartLineKey(i) === key ? { ...i, quantity: i.quantity + qty } : i
          );
        }
        return [...prev, line];
      });
    },
    []
  );

  const removeItem = useCallback((productId: string, variantId?: string | null) => {
    setItems((prev) =>
      prev.filter(
        (i) => !(i.productId === productId && (i.variantId ?? "") === (variantId ?? ""))
      )
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number, variantId?: string | null) => {
      if (quantity <= 0) {
        setItems((prev) =>
          prev.filter(
            (i) =>
              !(i.productId === productId && (i.variantId ?? "") === (variantId ?? ""))
          )
        );
        return;
      }
      setItems((prev) =>
        prev.map((i) =>
          i.productId === productId && (i.variantId ?? "") === (variantId ?? "")
            ? { ...i, quantity }
            : i
        )
      );
    },
    []
  );

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const totalDzd = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalDzd,
    }),
    [items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalDzd]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
