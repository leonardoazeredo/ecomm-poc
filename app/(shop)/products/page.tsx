import ProductCard from "@/components/products/ProductCard";
import { placeholderProducts, ProductDetail } from "@/lib/placeholder-data";

async function getProductsPlaceholder(): Promise<ProductDetail[]> {
  // TODO: Replace with actual data fetching from lib/contentful.ts

  await new Promise((resolve) => setTimeout(resolve, 150));

  return placeholderProducts;
}

export default async function ProductListPage() {
  const products = await getProductsPlaceholder();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Our Products</h1>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
