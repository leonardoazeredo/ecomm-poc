import { Cart, CartItem } from "@/app/(shop)/cart/page";
import { Redis } from "@upstash/redis";
import { cookies } from "next/headers";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const CART_EXPIRATION_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getCartKey(cartId: string): string {
  return `cart:${cartId}`;
}

//  Gets the cart ID from cookies. READ-ONLY. Safe for Server Components.
//  Returns the cart ID string or undefined if not found.

export async function getCartId(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value;
  return cartId;
}

// Sets the cart ID cookie. ONLY FOR USE IN SERVER ACTIONS / ROUTE HANDLERS.

export async function setCartIdCookie(cartId: string): Promise<void> {
  const cookieStore = await cookies(); // Need to await cookies() here too
  cookieStore.set("cartId", cartId, {
    path: "/",
    maxAge: CART_EXPIRATION_SECONDS,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  console.log(`Cart ID cookie set/refreshed: ${cartId}`);
}

// Deletes the cart ID cookie. ONLY FOR USE IN SERVER ACTIONS / ROUTE HANDLERS.

export async function deleteCartIdCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("cartId");
  console.log(`Cart ID cookie deleted.`);
}

export async function getCart(cartId: string): Promise<Cart | null> {
  if (!cartId) return null;
  const cartKey = getCartKey(cartId);
  const cartItemsRaw = await redis.hgetall(cartKey); // hgetall returns Record<string, unknown> | null
  if (!cartItemsRaw) return null;

  const items: CartItem[] = Object.entries(cartItemsRaw)
    .map(([productId, quantity]) => ({
      productId,
      quantity: Number(quantity) || 0,
    }))
    .filter((item) => item.quantity > 0);
  if (items.length === 0) return null;

  await redis.expire(cartKey, CART_EXPIRATION_SECONDS);
  return { id: cartId, items };
}

export async function addItemToCart(
  cartId: string,
  productId: string,
  quantity: number
): Promise<void> {
  if (!cartId || !productId || quantity <= 0) throw new Error("Invalid args");
  const cartKey = getCartKey(cartId);
  await redis.hincrby(cartKey, productId, quantity);
  await redis.expire(cartKey, CART_EXPIRATION_SECONDS);
  console.log(`Item ${productId} added/updated in Redis cart ${cartId}`);
}

export async function removeItemFromCart(
  cartId: string,
  productId: string
): Promise<void> {
  if (!cartId || !productId) throw new Error("Invalid args");
  const cartKey = getCartKey(cartId);
  const deletedCount = await redis.hdel(cartKey, productId);
  console.log(
    `Item ${productId} removed from Redis cart ${cartId} (Deleted: ${deletedCount})`
  );
  if (deletedCount > 0) await redis.expire(cartKey, CART_EXPIRATION_SECONDS);
}

export async function updateItemQuantity(
  cartId: string,
  productId: string,
  quantity: number
): Promise<void> {
  if (!cartId || !productId) throw new Error("Invalid args");
  const cartKey = getCartKey(cartId);
  if (quantity <= 0) {
    await removeItemFromCart(cartId, productId);
  } else {
    await redis.hset(cartKey, { [productId]: quantity });
    await redis.expire(cartKey, CART_EXPIRATION_SECONDS);
    console.log(
      `Item ${productId} quantity updated to ${quantity} in Redis cart ${cartId}`
    );
  }
}

// This function DELETES THE CART DATA FROM REDIS.
// It should NOT delete the cookie here. Cookie deletion happens in the action.

export async function deleteCart(cartId: string): Promise<void> {
  if (!cartId) return;
  const cartKey = getCartKey(cartId);
  const deleted = await redis.del(cartKey);
  console.log(`Redis Cart ${cartId} data deleted (Result: ${deleted}).`);
}
