import HeroSection from "@/components/home/HeroSection";
import ProductCarousel from "@/components/home/ProductsCarousel";
import { CarouselItem, getProductsForCarousel } from "@/lib/contentful";

export default async function Home() {
  const carouselItems: CarouselItem[] = await getProductsForCarousel(10);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <HeroSection />

        <ProductCarousel items={carouselItems} />
      </main>
    </div>
  );
}
