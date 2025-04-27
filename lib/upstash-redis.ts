import { Redis } from "@upstash/redis";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { Cart, CartItem } from "@/app/(shop)/cart/page";

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const CART_EXPIRATION_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getCartKey(cartId: string): string {
  return `cart:${cartId}`;
}

export async function getOrSetCartId(): Promise<string> {
  const cookieStore = await cookies();
  let cartId = cookieStore.get("cartId")?.value;

  if (!cartId) {
    cartId = randomUUID();
    console.log(`Generated new cartId and setting cookie: ${cartId}`);
  }

  cookieStore.set("cartId", cartId, {
    path: "/",
    maxAge: CART_EXPIRATION_SECONDS,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  return cartId;
}

// Fetches the cart items from Upstash Redis for a given cart ID.
// Uses Redis Hash.

export async function getCart(cartId: string): Promise<Cart | null> {
  if (!cartId) return null;

  const cartKey = getCartKey(cartId);

  const cartItemsRaw = await redis.hgetall(cartKey);

  if (!cartItemsRaw) {
    return null;
  }

  const items: CartItem[] = Object.entries(cartItemsRaw)
    .map(([productId, quantity]) => ({
      productId,
      quantity: Number(quantity) || 0,
    }))
    .filter((item) => item.quantity > 0);

  if (items.length === 0) {
    return null; // Cart is effectively empty
  }

  // Refresh cart expiration on read
  await redis.expire(cartKey, CART_EXPIRATION_SECONDS);

  return { id: cartId, items };
}

// Adds an item to the cart or updates its quantity if it already exists.
// Uses Redis Hash (hincrby).

export async function addItemToCart(
  cartId: string,
  productId: string,
  quantity: number
): Promise<void> {
  if (!cartId || !productId || quantity <= 0) {
    throw new Error("Invalid arguments for addItemToCart");
  }
  const cartKey = getCartKey(cartId);

  await redis.hincrby(cartKey, productId, quantity);
  await redis.expire(cartKey, CART_EXPIRATION_SECONDS);
  console.log(
    `Item ${productId} (qty: ${quantity}) added/updated in Upstash Redis cart ${cartId}`
  );
}

// Removes an item completely from the cart.
// Uses Redis Hash (hdel).
export async function removeItemFromCart(
  cartId: string,
  productId: string
): Promise<void> {
  if (!cartId || !productId) {
    throw new Error("Invalid arguments for removeItemFromCart");
  }
  const cartKey = getCartKey(cartId);

  const deletedCount = await redis.hdel(cartKey, productId);
  console.log(
    `Item ${productId} removed from Upstash Redis cart ${cartId} (Deleted: ${deletedCount})`
  );
  if (deletedCount > 0) {
    await redis.expire(cartKey, CART_EXPIRATION_SECONDS);
  }
}

// Updates the quantity of a specific item in the cart.
// Uses Redis Hash (hset). If quantity is 0 or less, removes the item.

export async function updateItemQuantity(
  cartId: string,
  productId: string,
  quantity: number
): Promise<void> {
  if (!cartId || !productId) {
    throw new Error("Invalid arguments for updateItemQuantity");
  }
  const cartKey = getCartKey(cartId);
  if (quantity <= 0) {
    await removeItemFromCart(cartId, productId);
  } else {
    // redis.hset signature might differ slightly for multiple fields vs single
    // For single field update, this is standard:
    await redis.hset(cartKey, { [productId]: quantity });
    console.log(
      `Item ${productId} quantity updated to ${quantity} in Upstash Redis cart ${cartId}`
    );
    await redis.expire(cartKey, CART_EXPIRATION_SECONDS);
  }
}

// Deletes the entire cart from Upstash Redis and removes the cookie.

export async function deleteCart(cartId: string): Promise<void> {
  if (!cartId) return;
  const cartKey = getCartKey(cartId);

  const deleted = await redis.del(cartKey);
  console.log(`Upstash Redis Cart ${cartId} deleted (Result: ${deleted}).`);

  const cookieStore = await cookies();
  cookieStore.delete("cartId");
  console.log(`Cart ID cookie cleared.`);
}
