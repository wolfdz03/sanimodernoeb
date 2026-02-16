"use client";

import { useCart } from "@/context/CartContext";
import { CheckoutForm } from "./CheckoutForm";
import { CheckoutEmpty } from "./CheckoutEmpty";
import type { SiteSettings } from "@/lib/site-settings";

interface CheckoutFromCartProps {
  settings?: SiteSettings | null;
}

export function CheckoutFromCart({ settings }: CheckoutFromCartProps) {
  const { items } = useCart();
  if (items.length === 0) {
    return <CheckoutEmpty settings={settings} />;
  }
  return <CheckoutForm items={items} settings={settings} />;
}
