import { ProductDetail } from "@/lib/placeholder-data";
import Image from "next/image";

interface ProductDetailsProps {
  product: ProductDetail;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="relative w-full aspect-square overflow-hidden rounded-lg shadow">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-2xl text-gray-800 mb-4">
          ${product.price.toFixed(2)}
        </p>
        <p className="text-gray-600 mb-6">{product.description}</p>

        {/* TODO: The AddToCartButton component needs to be created */}
        {/* <AddToCartButton productId={product.id} /> */}
      </div>
    </div>
  );
}
