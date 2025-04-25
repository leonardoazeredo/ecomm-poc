"use client";

import { useActionState, useEffect, useState, useRef } from "react";
import { addToCart } from "@/lib/actions";

interface AddToCartButtonProps {
  productId: string;
}

export default function AddToCartButton({ productId }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const formRef = useRef<HTMLFormElement>(null);

  const initialState = null;

  const [state, formAction, isPending] = useActionState(
    addToCart,
    initialState
  );

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

  const itemData = {
    productId: productId,
    quantity: quantity,
  };

  return (
    <form action={() => formAction(itemData)} ref={formRef}>
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
