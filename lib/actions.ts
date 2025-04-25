export async function addToCart(
  prevState: unknown,
  itemData: { productId: string; quantity: number }
) {
  console.log("Server Action addToCart executed");
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

    console.log(
      `Simulating adding product ${productId} (quantity: ${quantity}) to cart.`
    );

    // TODO: Call revalidatePath('/cart') or revalidateTag('cart') if the cart page data needs immediate refreshing after adding.
    // revalidatePath('/cart');

    return {
      success: true,
      message: `Added ${quantity} item(s) to cart!`,
    };
  } catch (error) {
    console.error("Error in addToCart Server Action:", error);

    return {
      success: false,
      message: "Failed to add item to cart. Please try again.",
      error: { formErrors: ["An unexpected error occurred."] },
    };
  }
}
