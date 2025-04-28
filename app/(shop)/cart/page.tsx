import Link from "next/link";
import Image from "next/image";
import { placeholderProducts, ProductDetail } from "@/lib/placeholder-data";
import CartItemControls from "@/components/cart/CartItemControls";
import { getCart, getCartId } from "@/lib/upstash-redis";

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
}

interface CartItemDetails extends CartItem {
  product: ProductDetail;
  lineTotal: number;
}

// Helper to enrich cart items with product details
function enrichCartItems(cart: Cart | null): CartItemDetails[] {
  if (!cart || !cart.items) return [];

  return cart.items
    .map((item) => {
      const product = placeholderProducts.find((p) => p.id === item.productId);
      if (!product) {
        // Handle case where product details aren't found (maybe log error)
        return null;
      }
      return {
        ...item,
        product,
        lineTotal: product.price * item.quantity,
      };
    })
    .filter((item): item is CartItemDetails => item !== null); // Filter out nulls
}

export default async function CartPage() {
  const cartId = await getCartId();
  console.log(`Cart Page rendering for cartId: ${cartId ?? "None"}`);

  let cart: Cart | null = null;

  if (cartId) {
    cart = await getCart(cartId);
  }

  const cartItemsDetails = enrichCartItems(cart);

  const cartTotal = cartItemsDetails.reduce(
    (sum, item) => sum + item.lineTotal,
    0
  );

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>

      {cartItemsDetails.length === 0 ? (
        <div className="text-center py-10 border rounded-md">
          <p className="text-xl text-gray-600 mb-4">Your cart is empty.</p>
          <Link href="/products" className="hover:text-white-800 font-semibold">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItemsDetails.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-4 border p-4 rounded-md shadow-sm"
              >
                <Link
                  href={`/products/${item.product.slug}`}
                  className="flex-shrink-0"
                >
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    width={80}
                    height={80}
                    className="rounded object-cover"
                  />
                </Link>

                <div className="flex-grow">
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="hover:underline"
                  >
                    <h3 className="font-semibold">{item.product.name}</h3>
                  </Link>
                  <p className="text-sm text-gray-500">
                    Unit Price: ${item.product.price.toFixed(2)}
                  </p>

                  <div className="mt-2 text-sm">
                    Quantity: {item.quantity}
                    <CartItemControls
                      productId={item.productId}
                      initialQuantity={item.quantity}
                    />
                  </div>
                </div>

                <div className="text-right font-semibold flex-shrink-0 w-24">
                  ${item.lineTotal.toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="border p-6 rounded-md shadow-sm  sticky top-24">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                Order Summary
              </h2>
              <div className="flex justify-between font-bold text-lg pt-4">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <button
                disabled // Disabled for PoC
                className="mt-6 w-full bg-yellow-600 text-white py-2 rounded-md font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Proceed to Checkout (Disabled)
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
