/**
 * @deprecated Use lib/marketing-events.ts instead (unified Meta + GA4 + GTM).
 * Re-exports for backward compatibility.
 */
import {
  trackViewProduct,
  trackAddToCart as trackAddToCartEvent,
  trackCheckout,
  trackPurchase as trackPurchaseEvent,
} from "./marketing-events";

export function trackViewContent(product: {
  id: string;
  name: string;
  price_dzd: number;
}) {
  trackViewProduct({
    product_id: product.id,
    product_name: product.name,
    price: product.price_dzd,
  });
}

export function trackAddToCart(item: {
  productId: string;
  name: string;
  price: number;
  quantity?: number;
}) {
  trackAddToCartEvent({
    product_id: item.productId,
    product_name: item.name,
    price: item.price,
    quantity: item.quantity ?? 1,
  });
}

export function trackInitiateCheckout(params: {
  value: number;
  num_items: number;
}) {
  trackCheckout({
    items: [], // legacy API did not pass items
    totalDzd: params.value,
  });
}

export function trackPurchase(params: {
  orderId: string;
  value: number;
}) {
  trackPurchaseEvent({
    order_id: params.orderId,
    order_value: params.value,
  });
}
