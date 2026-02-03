import React from 'react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemove: (id: string) => void;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onRemove,
  onIncrease,
  onDecrease,
}) => {
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? '' : 'pointer-events-none'}`}>
      {/* ===== Backdrop ===== */}
      <div
        className={`
          absolute inset-0 bg-black/40
          transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0'}
        `}
        onClick={onClose}
      />

      {/* ===== Drawer ===== */}
      <div
        className={`
          fixed right-0 top-0 h-full w-full max-w-md
          bg-white shadow-2xl
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">

          {/* ===== Header ===== */}
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h2 className="text-lg font-bold text-gray-900">
              Your Cart
            </h2>
            <button
              onClick={onClose}
              className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
            >
              ✕
            </button>
          </div>

          {/* ===== Items ===== */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center mt-20 text-center">
                <div className="text-5xl mb-4">🛒</div>
                <p className="text-gray-500">
                  Your cart is empty
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 text-indigo-600 font-medium hover:underline"
                >
                  Continue shopping
                </button>
              </div>
            ) : (
              cart.map(item => (
                <div
                  key={item.id}
                  className="flex gap-4 pb-4 border-b last:border-b-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover border"
                  />

                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 line-clamp-2">
                      {item.name}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      ₹{item.price.toLocaleString('en-IN')}
                    </p>

                    {/* Quantity */}
                    <div className="mt-3 flex items-center gap-3">
                      <button
                        onClick={() => onDecrease(item.id)}
                        className="
                          h-8 w-8 rounded-lg border
                          flex items-center justify-center
                          hover:bg-gray-100 transition
                        "
                      >
                        −
                      </button>

                      <span className="font-medium">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => onIncrease(item.id)}
                        className="
                          h-8 w-8 rounded-lg border
                          flex items-center justify-center
                          hover:bg-gray-100 transition
                        "
                      >
                        +
                      </button>

                      <button
                        onClick={() => onRemove(item.id)}
                        className="ml-auto text-sm text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="font-semibold text-gray-900">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ===== Footer ===== */}
          <div className="border-t px-5 py-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>

            <button
              disabled={cart.length === 0}
              className="
                mt-4 w-full py-3 rounded-xl font-medium
                bg-indigo-600 text-white
                hover:bg-indigo-700
                active:scale-95
                transition
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
