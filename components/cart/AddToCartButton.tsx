"use client";

import { useActionState, useEffect, useState } from "react";
import { addToCart, CartActionState } from "@/lib/actions";

interface AddToCartButtonProps {
  productId: string;
}

export default function AddToCartButton({ productId }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);

  const initialState = {
    success: false,
    message: "",
  };

  const [state, formAction, isPending] = useActionState<
    CartActionState,
    { productId: string; quantity: number }
  >(addToCart, initialState);

  useEffect(() => {
    if (state?.success) {
      console.log("Add to cart successful:", state.message);

      alert(state.message);
    } else if (state?.message) {
      console.error("Add to cart error:", state.message);

      alert(`Error: ${state.message}`);
    }
  }, [state]);

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(event.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity >= 1) {
      setQuantity(newQuantity);
    } else if (event.target.value === "") {
      setQuantity(1);
    }
  };

  const handleAddToCartSubmit = () => {
    const payload = {
      productId: productId,
      quantity: quantity,
    };

    formAction(payload);
  };

  return (
    <form action={handleAddToCartSubmit}>
      <div className="mb-4 flex items-center gap-4">
        <label htmlFor={`quantity-${productId}`} className="font-medium">
          Quantity:
        </label>
        <input
          id={`quantity-${productId}`}
          name="quantity"
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          min="1"
          className="w-16 p-2 border rounded-md text-center"
          disabled={isPending}
        />
      </div>
      <input type="hidden" name="productId" value={productId} />

      <button
        type="submit"
        disabled={isPending}
        className={`px-6 py-2 font-semibold rounded-md text-white transition-colors duration-200 ${
          isPending
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isPending ? "Adding..." : "Add to Cart"}
      </button>

      {state?.error?.formErrors && state.error.formErrors.length > 0 && (
        <div className="mt-2 text-red-600 text-sm">
          {state.error.formErrors.join(", ")}
        </div>
      )}
    </form>
  );
}
