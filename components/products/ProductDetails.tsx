import Image from "next/image";
import AddToCartButton from "../cart/AddToCartButton";
import { Product } from "@/lib/contentful";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

interface ProductDetailsProps {
  product: Product;
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
        {product.description ? (
          <p className="text-gray-600 mb-6">
            {documentToReactComponents(product.description)}
          </p>
        ) : (
          <p className="text-gray-500">No description available.</p>
        )}

        <AddToCartButton productId={product.id} />
      </div>
    </div>
  );
}
