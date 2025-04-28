"use client";

import { useState, useActionState, useEffect } from "react";
import { updateCartItemQuantity, removeCartItem } from "@/lib/actions";
import { CartActionState, CartItemControlsProps } from "@/lib/types";

export default function CartItemControls({
  productId,
  initialQuantity,
}: CartItemControlsProps) {
  const [currentQuantity, setCurrentQuantity] = useState(initialQuantity);

  // Keep local state in sync if the prop changes (like after revalidation)
  useEffect(() => {
    setCurrentQuantity(initialQuantity);
  }, [initialQuantity]);

  const initialState = {
    success: false,
    message: "",
  };

  const [updateState, updateFormAction, isUpdatePending] = useActionState<
    CartActionState,
    { productId: string; newQuantity: number }
  >(updateCartItemQuantity, initialState);

  const [removeState, removeFormAction, isRemovePending] = useActionState<
    CartActionState,
    { productId: string }
  >(removeCartItem, initialState);

  const isPending = isUpdatePending || isRemovePending;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") {
      // Handle empty input temporarily, maybe reset to 1 or previous valid?
      setCurrentQuantity(1);
    } else {
      const num = parseInt(val, 10);
      if (!isNaN(num) && num >= 1) {
        setCurrentQuantity(num);
      } else if (!isNaN(num) && num < 1) {
        setCurrentQuantity(1);
      }
    }
  };

  const handleDecrement = () => {
    if (currentQuantity > 1) {
      const newQuantity = currentQuantity - 1;
      setCurrentQuantity(newQuantity);
      updateFormAction({ productId, newQuantity });
    } else {
      handleRemove();
    }
  };

  const handleIncrement = () => {
    const newQuantity = currentQuantity + 1;
    updateFormAction({ productId, newQuantity });
  };

  const handleRemove = () => {
    removeFormAction({ productId });
  };

  return (
    <div className="flex items-center space-x-2 mt-2">
      <div className="flex items-center border rounded">
        <form action={handleDecrement} className="contents">
          <button
            type="submit"
            disabled={isPending}
            className="px-2 py-1 border-r disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Decrease quantity"
          >
            -
          </button>
        </form>

        <input
          type="number"
          name="quantity"
          value={currentQuantity}
          onChange={handleInputChange}
          min="1"
          className="w-12 text-center py-1 focus:outline-none disabled:bg-gray-100"
          disabled={isPending}
          aria-label="Item quantity"
        />

        <form action={handleIncrement} className="contents">
          <button
            type="submit"
            disabled={isPending}
            className="px-2 py-1 border-l disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Increase quantity"
          >
            +
          </button>
        </form>
      </div>

      <form action={handleRemove} className="contents">
        <button
          type="submit"
          disabled={isPending}
          className="text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm px-2 py-1"
          aria-label="Remove item"
        >
          {isRemovePending ? "Removing..." : "Remove"}
        </button>
      </form>

      {isUpdatePending && "Updating..."}

      {updateState && !updateState.success && (
        <span className="text-xs text-red-600 ml-2">{updateState.message}</span>
      )}
      {removeState && !removeState.success && (
        <span className="text-xs text-red-600 ml-2">{removeState.message}</span>
      )}

      {updateState?.success && (
        <span className="text-xs text-green-600 ml-2">Updated!</span>
      )}
      {removeState?.success && (
        <span className="text-xs text-green-600 ml-2">Removed!</span>
      )}
    </div>
  );
}
