import { getProductById } from "@/lib/supabase/queries";
import { getProductPrimaryImage } from "@/lib/product-images";
import { CheckoutForm } from "./CheckoutForm";
import { CheckoutEmpty } from "./CheckoutEmpty";
import { CheckoutSuccess } from "./CheckoutSuccess";

interface PageProps {
  searchParams: Promise<{ productId?: string; qty?: string; success?: string; total?: string }>;
}

export default async function CheckoutPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { productId, qty: qtyParam, success, total } = params;

  if (success) {
    const totalDzd = total ? parseInt(total, 10) : undefined;
    return <CheckoutSuccess orderId={success} totalDzd={totalDzd} />;
  }

  if (!productId) {
    return <CheckoutEmpty />;
  }

  const product = await getProductById(productId);
  if (!product) {
    return <CheckoutEmpty />;
  }

  const quantity = Math.max(1, parseInt(qtyParam ?? "1", 10) || 1);
  const imageUrl = getProductPrimaryImage(product) ?? "/placeholder-product.png";
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
