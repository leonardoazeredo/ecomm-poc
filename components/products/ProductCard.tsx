import Link from "next/link";
import Image from "next/image";

import { ProductDetail } from "@/lib/placeholder-data";

interface ProductCardProps {
  product: ProductDetail;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-200"
    >
      <div className="relative w-full aspect-square overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold truncate">{product.name}</h3>
        <p className="text-gray-600">${product.price.toFixed(2)}</p>
      </div>
    </Link>
  );
}
