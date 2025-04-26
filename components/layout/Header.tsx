import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-black shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          href="/"
          className="text-xl font-bold text-gray-800 hover:text-blue-600"
        >
          MyEcommStore
        </Link>

        <div className="flex items-center space-x-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <Link href="/products" className="text-gray-600 hover:text-gray-900">
            Products
          </Link>
          <Link
            href="/cart"
            className="text-gray-600 hover:text-gray-900 relative"
          >
            Cart
          </Link>
        </div>
      </nav>
    </header>
  );
}
