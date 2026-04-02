export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type OrderStatus =
  | "pending"
  | "paid"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon_name: string | null;
  color: string | null;
  bg_color: string | null;
  text_color: string | null;
  sort_order: number;
  created_at: string;
}

export interface ProductOptionType {
  id: string;
  product_id: string;
  name: string;
  sort_order: number;
  product_option_values?: ProductOptionValue[];
}

export interface ProductOptionValue {
  id: string;
  option_type_id: string;
  value: string;
  sort_order: number;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string | null;
  price_dzd: number | null;
  stock: number;
  created_at: string;
  product_variant_options?: { option_value_id: string; product_option_values?: ProductOptionValue }[];
}

export interface ProductVariantOption {
  variant_id: string;
  option_value_id: string;
}

export interface ProductAttribute {
  id: string;
  product_id: string;
  name: string;
  value: string;
  sort_order: number;
}

export interface Product {
  id: string;
  category_id: string | null;
  /** 1-based index within the same category (URL segment 0001, 0002, …). */
  category_sequence?: number | null;
  name: string;
  slug: string;
  description: string | null;
  price_dzd: number;
  price_old_dzd?: number | null;
  image_url: string | null;
  /** Multiple images (first is primary). Fallback: use image_url if image_urls empty. */
  image_urls?: string[] | null;
  badge: string | null;
  badge_color: string | null;
  stock: number;
  created_at: string;
  categories?: { name: string; slug?: string } | null;
  /** Option dimensions and values (for variant selector) */
  product_option_types?: ProductOptionType[];
  /** Variants with their option links (for PDP and cart) */
  product_variants?: ProductVariant[];
  /** Specs/attributes for PDP display */
  product_attributes?: ProductAttribute[];
}

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  role: "customer" | "admin";
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  status: OrderStatus;
  total_dzd: number;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_email: string | null;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price_dzd: number;
  variant_id?: string | null;
  variant_label?: string | null;
}
