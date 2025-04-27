import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-black shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold  hover:text-gray-400">
          MyEcommStore
        </Link>

        <div className="flex items-center space-x-6">
          <Link href="/products" className="hover:text-gray-400">
            Products
          </Link>
          <Link href="/cart" className="hover:text-gray-400 relative">
            Cart
          </Link>
        </div>
      </nav>
    </header>
  );
}
