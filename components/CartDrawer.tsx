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
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 flex justify-between items-center border-b">
            <h2 className="text-xl font-bold">Your Cart</h2>
            <button onClick={onClose}>✕</button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <p className="text-center text-gray-500 mt-10">
                Your cart is empty
              </p>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 py-4 border-b last:border-b-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded object-cover border"
                  />

                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>

                    <p className="text-sm text-gray-500 mt-1">
                      ₹{item.price.toLocaleString('en-IN')}
                    </p>

                    {/* Quantity Controls */}
                    <div className="mt-3 flex items-center gap-3">
                      <button
                        onClick={() => onDecrease(item.id)}
                        className="w-8 h-8 rounded border text-lg hover:bg-gray-100"
                      >
                        −
                      </button>

                      <span className="font-medium">{item.quantity}</span>

                      <button
                        onClick={() => onIncrease(item.id)}
                        className="w-8 h-8 rounded border text-lg hover:bg-gray-100"
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

                  <div className="font-semibold">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t p-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>

            <button
              disabled={cart.length === 0}
              className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-md font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
