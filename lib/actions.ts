"use server";

import { revalidatePath } from "next/cache";
import {
  addItemToCart as addItemToRedisCart,
  updateItemQuantity as updateItemQuantityInRedis,
  removeItemFromCart as removeItemFromRedisCart,
  getCartId,
  setCartIdCookie,
} from "./upstash-redis";
import { randomUUID } from "crypto";
import { CartActionState } from "./types";

export async function addToCart(
  prevState: CartActionState,
  itemData: { productId: string; quantity: number }
) {
  let cartId = await getCartId();

  if (!cartId) {
    cartId = randomUUID();
    await setCartIdCookie(cartId);
    console.log(`Action: addToCart | New CartID generated: ${cartId}`);
  } else {
    await setCartIdCookie(cartId);
    console.log(`Action: addToCart | Existing CartID: ${cartId}`);
  }
  console.log(`Item: ${JSON.stringify(itemData)}`);

  try {
    const { productId, quantity } = itemData;

    if (quantity <= 0) {
      return {
        success: false,
        message: "Quantity must be positive.",
        error: { formErrors: ["Quantity must be positive."] },
      };
    }
    if (!productId) {
      return {
        success: false,
        message: "Product ID is missing.",
        error: { formErrors: ["Product ID is missing."] },
      };
    }

    await addItemToRedisCart(cartId, productId, quantity);

    revalidatePath("/cart");

    return { success: true, message: `Added ${quantity} item(s) to cart!` };
  } catch (error) {
    console.error("Error in addToCart Server Action:", error);

    return {
      success: false,
      message: "Failed to add item. Please try again.",
      error: { formErrors: ["Database error."] },
    };
  }
}

export async function updateCartItemQuantity(
  prevState: CartActionState,
  itemData: { productId: string; newQuantity: number }
) {
  const cartId = await getCartId();
  if (!cartId)
    return {
      success: false,
      message: "Cart not found.",
      error: { formErrors: ["No active cart."] },
    };

  await setCartIdCookie(cartId);
  console.log(
    `Action: updateCartItemQuantity | CartID: ${cartId} | Item: ${JSON.stringify(
      itemData
    )}`
  );

  try {
    const { productId, newQuantity } = itemData;
    if (!productId)
      return {
        success: false,
        message: "Product ID is missing.",
        error: { formErrors: ["Product ID is missing."] },
      };

    await updateItemQuantityInRedis(cartId, productId, newQuantity);
    revalidatePath("/cart");
    return {
      success: true,
      message: `Updated ${productId} quantity to ${newQuantity}.`,
      cartId,
    };
  } catch (error) {
    console.error("Error in updateCartItemQuantity action:", error);
    const message =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      success: false,
      message: `Failed to update quantity: ${message}`,
      error: { formErrors: [message] },
    };
  }
}

export async function removeCartItem(
  prevState: CartActionState,
  itemData: { productId: string }
) {
  const cartId = await getCartId();
  if (!cartId)
    return {
      success: false,
      message: "Cart not found.",
      error: { formErrors: ["No active cart."] },
    };

  await setCartIdCookie(cartId);

  console.log(
    `Action: removeCartItem | CartID: ${cartId} | Item: ${JSON.stringify(
      itemData
    )}`
  );

  try {
    const { productId } = itemData;
    if (!productId)
      return {
        success: false,
        message: "Product ID is missing.",
        error: { formErrors: ["Product ID is missing."] },
      };

    await removeItemFromRedisCart(cartId, productId);
    revalidatePath("/cart");
    return {
      success: true,
      message: `Removed ${productId} from cart.`,
      cartId,
    };
  } catch (error) {
    console.error("Error in removeCartItem action:", error);
    const message =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      success: false,
      message: `Failed to remove item: ${message}`,
      error: { formErrors: [message] },
    };
  }
}
