"use server";

import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/session";
import type { CartItem } from "@/context/CartContext";
import { createServiceClient } from "@/lib/supabase/service";
import { getShippingRates } from "./shipping";
import { getSiteSettings } from "@/lib/site-settings";

export interface CheckoutFormData {
  shipping_name: string;
  shipping_phone: string;
  shipping_wilaya: string;
  shipping_city: string;
  shipping_address: string;
}

export async function createOrder(
  items: CartItem[],
  formData: CheckoutFormData
) {
  if (items.length === 0) {
    return { error: "Le panier est vide." };
  }
  if (!formData.shipping_name?.trim() || !formData.shipping_phone?.trim() || !formData.shipping_wilaya?.trim() || !formData.shipping_city?.trim() || !formData.shipping_address?.trim()) {
    return { error: "Veuillez compléter toutes les informations de livraison." };
  }

  const supabase = await createClient();
  const service = createServiceClient();
  const user = await getSession();
  const productIds = [...new Set(items.map((item) => item.productId).filter(Boolean))];
  const { data: products, error: productsError } = await service
    .from("products")
    .select("id, name, price_dzd, stock")
    .in("id", productIds);
  if (productsError || !products || products.length !== productIds.length) {
    return { error: "Un produit de votre panier n'est plus disponible." };
  }
  const productsById = new Map(products.map((product) => [product.id, product]));
  const variantIds = [...new Set(items.map((item) => item.variantId).filter((id): id is string => Boolean(id)))];
  const variantsById = new Map<string, { id: string; product_id: string; price_dzd: number | null; stock: number }>();
  if (variantIds.length) {
    const { data: variants, error: variantsError } = await service
      .from("product_variants")
      .select("id, product_id, price_dzd, stock")
      .in("id", variantIds);
    if (variantsError || !variants || variants.length !== variantIds.length) {
      return { error: "Une variante de votre panier n'est plus disponible." };
    }
    variants.forEach((variant) => variantsById.set(variant.id, variant));
  }

  const verifiedItems: {
    product_id: string;
    product_name: string;
    quantity: number;
    unit_price_dzd: number;
    variant_id: string | null;
    variant_label: string | null;
  }[] = [];
  for (const item of items) {
    const product = productsById.get(item.productId);
    const quantity = Math.floor(Number(item.quantity));
    if (!product || !Number.isFinite(quantity) || quantity < 1) return { error: "Quantité invalide." };
    const variant = item.variantId ? variantsById.get(item.variantId) : null;
    if (item.variantId && (!variant || variant.product_id !== product.id)) return { error: "Variante invalide." };
    const stock = variant ? variant.stock : product.stock;
    if (quantity > stock) return { error: `${product.name} n'a plus assez de stock.` };
    verifiedItems.push({
      product_id: product.id,
      product_name: product.name,
      quantity,
      unit_price_dzd: Number(variant?.price_dzd ?? product.price_dzd),
      variant_id: variant?.id ?? null,
      variant_label: item.variantLabel?.trim() || null,
    });
  }
  const subtotal_dzd = verifiedItems.reduce((sum, item) => sum + item.unit_price_dzd * item.quantity, 0);
  const shippingRates = await getShippingRates();
  const settings = await getSiteSettings();
  const shipping_cost_dzd =
    settings.free_delivery_threshold_dzd && subtotal_dzd >= settings.free_delivery_threshold_dzd
      ? 0
      : Math.max(0, Math.round(Number(shippingRates[formData.shipping_wilaya.trim()]) || 0));
  const total_dzd = subtotal_dzd + shipping_cost_dzd;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user?.id ?? null,
      status: "pending",
      total_dzd,
      shipping_cost_dzd,
      shipping_name: formData.shipping_name.trim(),
      shipping_phone: formData.shipping_phone.trim(),
      shipping_wilaya: formData.shipping_wilaya?.trim() || null,
      shipping_city: formData.shipping_city?.trim() || null,
      shipping_address: formData.shipping_address.trim(),
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return { error: orderError?.message ?? "Impossible de créer la commande." };
  }

  const orderItems = verifiedItems.map((item) => ({ ...item, order_id: order.id }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    return { error: "Erreur lors de l'enregistrement des articles." };
  }

  // Optional: send new order notification email to admin
  try {
    const { getSiteSettings } = await import("@/lib/site-settings");
    const { sendNewOrderNotification } = await import("@/lib/email");
    const settings = await getSiteSettings();
    const toEmail = settings.admin_notification_email?.trim() || process.env.ADMIN_NOTIFICATION_EMAIL?.trim();
    if (toEmail && process.env.RESEND_API_KEY) {
      await sendNewOrderNotification({
        orderId: order.id,
        totalDzd: total_dzd,
        shippingName: formData.shipping_name.trim(),
        toEmail,
      });
    }
  } catch {
    // Don't fail order creation if notification fails
  }

  return { orderId: order.id, totalDzd: total_dzd };
}

export async function updateOrderStatus(
  orderId: string,
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled"
) {
  const { createServiceClient } = await import("@/lib/supabase/service");
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);
  if (error) return { error: error.message };
  return {};
}

export async function bulkUpdateOrderStatus(
  orderIds: string[],
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled"
) {
  const { createServiceClient } = await import("@/lib/supabase/service");
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .in("id", orderIds);
  if (error) return { error: error.message };
  return {};
}

export async function trackOrder(orderId: string) {
  const { createServiceClient } = await import("@/lib/supabase/service");
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        id,
        product_id,
        quantity,
        unit_price_dzd,
        product_name,
        variant_label
      )
    `)
    .eq("id", orderId)
    .single();

  if (error || !data) {
    return { error: "Commande introuvable. Veuillez vérifier le numéro de commande." };
  }
  return { order: data };
}
