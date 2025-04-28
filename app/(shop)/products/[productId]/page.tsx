import ProductDetails from "@/components/products/ProductDetails";
import { getProductBySlug } from "@/lib/contentful";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: Promise<{ productId: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId } = await params;

  const product = await getProductBySlug(productId);

  if (!product) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <ProductDetails product={product} />
    </main>
  );
}
