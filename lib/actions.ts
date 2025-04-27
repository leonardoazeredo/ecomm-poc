"user server";

import { revalidatePath } from "next/cache";
import {
  getOrSetCartId,
  addItemToCart as addItemToRedisCart,
  updateItemQuantity as updateItemQuantityInRedis,
  removeItemFromCart as removeItemFromRedisCart,
} from "./upstash-redis";

export async function addToCart(
  prevState: unknown,
  itemData: { productId: string; quantity: number }
) {
  const cartId = await getOrSetCartId();

  console.log(`Server Action addToCart for cartId: ${cartId}`);
  console.log("Previous State:", prevState);
  console.log("Item Data:", itemData);

  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

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
  prevState: unknown,
  itemData: { productId: string; newQuantity: number }
) {
  const cartId = await getOrSetCartId();
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
  prevState: unknown,
  itemData: { productId: string }
) {
  const cartId = await getOrSetCartId(); // Must await in Next.js 15
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
