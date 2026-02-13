/**
 * Facebook (Meta) Pixel event helpers.
 * Call these from client components when the Pixel is loaded.
 */
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackViewContent(product: {
  id: string;
  name: string;
  price_dzd: number;
}) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "ViewContent", {
      content_name: product.name,
      content_ids: [product.id],
      content_type: "product",
      value: product.price_dzd,
      currency: "DZD",
    });
  }
}

export function trackAddToCart(item: {
  productId: string;
  name: string;
  price: number;
  quantity?: number;
}) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "AddToCart", {
      content_name: item.name,
      content_ids: [item.productId],
      content_type: "product",
      value: item.price * (item.quantity ?? 1),
      currency: "DZD",
    });
  }
}

export function trackInitiateCheckout(params: {
  value: number;
  num_items: number;
}) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "InitiateCheckout", {
      value: params.value,
      currency: "DZD",
      num_items: params.num_items,
    });
  }
}

export function trackPurchase(params: {
  orderId: string;
  value: number;
}) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Purchase", {
      value: params.value,
      currency: "DZD",
      order_id: params.orderId,
    });
  }
}
