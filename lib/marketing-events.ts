/**
 * Unified marketing event layer: Meta Pixel, GA4, GTM dataLayer.
 * Call from client components when the corresponding scripts are loaded.
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const CURRENCY = "DZD";

/** Product shape for ViewContent / view_item */
export interface ViewProductPayload {
  product_id: string;
  product_name: string;
  category?: string | null;
  variant?: string | null;
  price: number;
  currency?: string;
}

/** Line item for add_to_cart / begin_checkout / purchase */
export interface CartLinePayload {
  product_id: string;
  product_name: string;
  category?: string | null;
  variant?: string | null;
  price: number;
  quantity: number;
  currency?: string;
}

/** Cart for InitiateCheckout / begin_checkout */
export interface CheckoutCartPayload {
  items: CartLinePayload[];
  totalDzd: number;
}

/** Order for Purchase / purchase */
export interface PurchaseOrderPayload {
  order_id: string;
  order_value: number;
  items?: CartLinePayload[];
  currency?: string;
}

function pushDataLayer(event: string, params: Record<string, unknown>) {
  if (typeof window !== "undefined" && Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event, ...params });
  }
}

/** GA4 item format */
function toGa4Item(line: CartLinePayload) {
  return {
    item_id: line.product_id,
    item_name: line.product_name,
    item_category: line.category ?? undefined,
    item_variant: line.variant ?? undefined,
    price: line.price,
    quantity: line.quantity,
    currency: line.currency ?? CURRENCY,
  };
}

export function trackViewProduct(product: ViewProductPayload) {
  if (typeof window === "undefined") return;
  const payload = {
    product_id: product.product_id,
    product_name: product.product_name,
    category: product.category ?? undefined,
    variant: product.variant ?? undefined,
    price: product.price,
    currency: product.currency ?? CURRENCY,
  };

  if (window.fbq) {
    window.fbq("track", "ViewContent", {
      content_name: product.product_name,
      content_ids: [product.product_id],
      content_type: "product",
      content_category: product.category ?? undefined,
      value: product.price,
      currency: payload.currency,
    });
  }

  if (window.gtag) {
    window.gtag("event", "view_item", {
      currency: payload.currency,
      value: product.price,
      items: [
        {
          item_id: product.product_id,
          item_name: product.product_name,
          item_category: product.category ?? undefined,
          item_variant: product.variant ?? undefined,
          price: product.price,
          quantity: 1,
          currency: payload.currency,
        },
      ],
    });
  }

  pushDataLayer("view_item", payload);
  pushDataLayer("ViewContent", payload);
}

export function trackAddToCart(
  product: CartLinePayload | (Omit<CartLinePayload, "quantity"> & { quantity?: number })
) {
  if (typeof window === "undefined") return;
  const qty = "quantity" in product ? (product.quantity ?? 1) : 1;
  const line: CartLinePayload = {
    product_id: product.product_id,
    product_name: product.product_name,
    category: product.category ?? null,
    variant: product.variant ?? null,
    price: product.price,
    quantity: qty,
    currency: product.currency ?? CURRENCY,
  };
  const value = line.price * line.quantity;

  if (window.fbq) {
    window.fbq("track", "AddToCart", {
      content_name: line.product_name,
      content_ids: [line.product_id],
      content_type: "product",
      content_category: line.category ?? undefined,
      value,
      currency: line.currency,
      num_items: line.quantity,
    });
  }

  if (window.gtag) {
    window.gtag("event", "add_to_cart", {
      currency: line.currency,
      value,
      items: [toGa4Item(line)],
    });
  }

  pushDataLayer("add_to_cart", { ...line, order_value: value });
  pushDataLayer("AddToCart", { ...line, order_value: value });
}

export function trackCheckout(cart: CheckoutCartPayload) {
  if (typeof window === "undefined") return;
  const { items, totalDzd } = cart;
  const ga4Items = items.map(toGa4Item);

  if (window.fbq) {
    window.fbq("track", "InitiateCheckout", {
      value: totalDzd,
      currency: CURRENCY,
      num_items: items.reduce((s, i) => s + i.quantity, 0),
    });
  }

  if (window.gtag) {
    window.gtag("event", "begin_checkout", {
      currency: CURRENCY,
      value: totalDzd,
      items: ga4Items,
    });
  }

  pushDataLayer("begin_checkout", { items, order_value: totalDzd, currency: CURRENCY });
  pushDataLayer("InitiateCheckout", { items, order_value: totalDzd, currency: CURRENCY });
}

export function trackPurchase(order: PurchaseOrderPayload) {
  if (typeof window === "undefined") return;
  const { order_id, order_value, items = [] } = order;
  const currency = order.currency ?? CURRENCY;

  if (window.fbq) {
    window.fbq("track", "Purchase", {
      value: order_value,
      currency,
      order_id,
    });
  }

  if (window.gtag) {
    window.gtag("event", "purchase", {
      transaction_id: order_id,
      value: order_value,
      currency,
      items: items.map(toGa4Item),
    });
  }

  pushDataLayer("purchase", {
    order_id,
    order_value,
    currency,
    items,
  });
  pushDataLayer("Purchase", {
    order_id,
    order_value,
    currency,
    items,
  });
}
