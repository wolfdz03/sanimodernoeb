import { getProductById, getVariantForCart } from "@/lib/supabase/queries";
import { getProductPrimaryImage } from "@/lib/product-images";
import { getSiteSettings } from "@/lib/site-settings";
import { CheckoutForm } from "./CheckoutForm";
import { CheckoutSuccess } from "./CheckoutSuccess";
import { CheckoutFromCart } from "./CheckoutFromCart";

interface PageProps {
  searchParams: Promise<{
    productId?: string;
    variantId?: string;
    qty?: string;
    success?: string;
    total?: string;
  }>;
}

export default async function CheckoutPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { productId, variantId, qty: qtyParam, success, total } = params;
  const settings = await getSiteSettings();

  if (success) {
    const totalDzd = total ? parseInt(total, 10) : undefined;
    return <CheckoutSuccess orderId={success} totalDzd={totalDzd} settings={settings} />;
  }

  if (!productId) {
    return <CheckoutFromCart settings={settings} />;
  }

  const product = await getProductById(productId);
  if (!product) {
    return <CheckoutFromCart settings={settings} />;
  }

  const quantity = Math.max(1, parseInt(qtyParam ?? "1", 10) || 1);
  const imageUrl = getProductPrimaryImage(product) ?? "/placeholder-product.png";

  if (variantId) {
    const variantInfo = await getVariantForCart(variantId, productId);
    if (variantInfo) {
      const items = [
        {
          productId: variantInfo.productId,
          name: variantInfo.name,
          price: variantInfo.price,
          image: variantInfo.imageUrl ?? imageUrl,
          quantity,
          variantId: variantInfo.variantId,
          variantLabel: variantInfo.variantLabel,
        },
      ];
      return <CheckoutForm items={items} settings={settings} />;
    }
  }

  const items = [
    {
      productId: product.id,
      name: product.name,
      price: product.price_dzd,
      image: imageUrl,
      quantity,
    },
  ];

  return <CheckoutForm items={items} settings={settings} />;
}
