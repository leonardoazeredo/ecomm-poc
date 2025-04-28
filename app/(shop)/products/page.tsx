import ProductCard from "@/components/products/ProductCard";
import { getAllProducts, Product } from "@/lib/contentful";

async function getProductsPlaceholder(): Promise<Product[]> {
  return await getAllProducts();
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
