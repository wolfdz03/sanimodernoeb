import { NextResponse } from "next/server";
import { getProducts } from "@/lib/supabase/queries";
import { getProductPrimaryImage } from "@/lib/product-images";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim().slice(0, 100) ?? "";

  if (!query) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const products = await getProducts({ search: query, limit: 6 });
    const suggestions = products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      priceDzd: product.price_dzd,
      imageUrl: getProductPrimaryImage(product),
      category:
        product.categories && "name" in product.categories
          ? product.categories.name
          : null,
    }));

    return NextResponse.json(
      { suggestions },
      { headers: { "Cache-Control": "private, max-age=30" } }
    );
  } catch {
    return NextResponse.json({ suggestions: [] }, { status: 200 });
  }
}
