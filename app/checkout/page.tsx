import { getProductById } from "@/lib/supabase/queries";
import { CheckoutForm } from "./CheckoutForm";
import { CheckoutEmpty } from "./CheckoutEmpty";
import { CheckoutSuccess } from "./CheckoutSuccess";

interface PageProps {
  searchParams: Promise<{ productId?: string; qty?: string; success?: string }>;
}

export default async function CheckoutPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { productId, qty: qtyParam, success } = params;

  if (success) {
    return <CheckoutSuccess orderId={success} />;
  }

  if (!productId) {
    return <CheckoutEmpty />;
  }

  const product = await getProductById(productId);
  if (!product) {
    return <CheckoutEmpty />;
  }

  const quantity = Math.max(1, parseInt(qtyParam ?? "1", 10) || 1);
  const imageUrl = product.image_url ?? "/placeholder-product.png";
  const items = [
    {
      productId: product.id,
      name: product.name,
      price: product.price_dzd,
      image: imageUrl,
      quantity,
    },
  ];

  return <CheckoutForm items={items} />;
}
