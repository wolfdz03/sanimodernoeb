"use server";

import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/session";
import type { CartItem } from "@/context/CartContext";

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

  const supabase = await createClient();
  const user = await getSession();

  const total_dzd = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user?.id ?? null,
      status: "pending",
      total_dzd,
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

  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    product_name: item.name,
    quantity: item.quantity,
    unit_price_dzd: item.price,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    return { error: "Erreur lors de l'enregistrement des articles." };
  }

  return { orderId: order.id };
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
