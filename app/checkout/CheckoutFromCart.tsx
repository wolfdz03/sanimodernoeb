"use client";

import { useCart } from "@/context/CartContext";
import { CheckoutForm } from "./CheckoutForm";
import { CheckoutEmpty } from "./CheckoutEmpty";
import type { SiteSettings } from "@/lib/site-settings";

interface CheckoutFromCartProps {
  settings?: SiteSettings | null;
  shippingRates?: Record<string, number>;
}

export function CheckoutFromCart({ settings, shippingRates }: CheckoutFromCartProps) {
  const { items } = useCart();
  if (items.length === 0) {
    return <CheckoutEmpty settings={settings} />;
  }
  return <CheckoutForm items={items} settings={settings} shippingRates={shippingRates} />;
}
