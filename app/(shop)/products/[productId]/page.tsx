import ProductDetails from "@/components/products/ProductDetails";
import { placeholderProducts, ProductDetail } from "@/lib/placeholder-data";
import { notFound } from "next/navigation";

async function getProductDetailsPlaceholder(
  productIdSlug: string
): Promise<ProductDetail | null> {
  // TODO: Replace with actual data fetching from lib/contentful.ts using productId (slug)

  await new Promise((resolve) => setTimeout(resolve, 50)); // Simulate network delay

  const product = placeholderProducts.find((p) => p.slug === productIdSlug);
  return product || null;
}

interface ProductPageProps {
  params: Promise<{ productId: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId } = await params;

  const product = await getProductDetailsPlaceholder(productId);

  if (!product) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <ProductDetails product={product} />

      {/* <div className="mt-6"> */}
      {/*   <AddToCartButton productId={product.id} /> */}
      {/* </div> */}
    </main>
  );
}
