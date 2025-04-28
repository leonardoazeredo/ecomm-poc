import Link from "next/link";
import Image from "next/image";

interface CarouselItem {
  imageUrl: string;
  alt: string;
  contentfulId: string;
}

interface ProductCarouselProps {
  items: CarouselItem[];
}

export default function ProductCarousel({ items }: ProductCarouselProps) {
  if (!items || items.length === 0) {
    return null;
  }
  const duplicatedItems = [
    ...items,
    ...items,
    ...items,
    ...items,
    ...items,
    ...items,
    ...items,
    ...items,
    ...items,
  ];

  return (
    <section className="py-12 md:py-20 w-full overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">
          Featured Products
        </h2>

        <Link
          href="/products"
          className="block group cursor-pointer"
          aria-label="View all products"
        >
          <div
            className="w-full overflow-hidden relative"
            style={
              { "--carousel-items-count": items.length } as React.CSSProperties
            }
          >
            <div className="flex animate-infinite-scroll">
              {duplicatedItems.map((item, index) => (
                <div
                  key={`${item.contentfulId}-${index}`}
                  className="flex-shrink-0 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 p-2"
                >
                  <div className="aspect-square relative overflow-hidden rounded-lg shadow-md">
                    <Image
                      src={item.imageUrl}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
