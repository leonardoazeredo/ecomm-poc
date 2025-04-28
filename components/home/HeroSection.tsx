import Link from "next/link";
// import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative py-20 md:py-32 text-center overflow-hidden">
      {/* <Image
         src="/path/to/your/hero-background.jpg"
         alt="Hero background"
         layout="fill"
         objectFit="cover"
         quality={80}
         className="absolute inset-0 z-0 opacity-30"
       /> */}
      <div className="container mx-auto px-4 relative z-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 leading-tight">
          Discover Your Next Favorite Thing
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Explore our curated collection of high-quality products designed to
          inspire.
        </p>
        <Link
          href="/products"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-md shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
        >
          Shop All Products
        </Link>
      </div>
    </section>
  );
}
