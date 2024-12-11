import React, { useRef, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem?: (index: number) => void;
  onUpdateQuantity?: (index: number, quantity: number) => void;
}

const Cart: React.FC<CartProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onUpdateQuantity,
}) => {
  const { theme } = useTheme();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50">
      <div
        ref={modalRef}
        className={`relative w-full max-w-md rounded-lg p-6 shadow-xl ${
          theme.isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-2xl"
        >
          ×
        </button>

        <h2 className="mb-4 text-2xl font-bold">Your Cart</h2>

        {items.length === 0 ? (
          <p className="text-center">Your cart is empty</p>
        ) : (
          <>
            <div className="mb-4 max-h-[60vh] overflow-y-auto">
              {items.map((item, index) => (
                <div
                  key={index}
                  className={`mb-2 flex items-center justify-between rounded-lg p-3 ${
                    theme.isDarkMode ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p>
                      ${item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateQuantity?.(
                            index,
                            Math.max(1, item.quantity - 1),
                          )
                        }
                        className="rounded-full bg-gray-200 px-2 py-1 text-black hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateQuantity?.(index, item.quantity + 1)
                        }
                        className="rounded-full bg-gray-200 px-2 py-1 text-black hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                    {onRemoveItem && (
                      <button
                        type="button"
                        onClick={() => onRemoveItem(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="mb-4 flex justify-between text-xl font-bold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button
                type="button"
                className="w-full rounded-lg bg-blue-500 px-6 py-3 text-lg font-bold text-white transition-all hover:bg-blue-600 active:bg-blue-700"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
