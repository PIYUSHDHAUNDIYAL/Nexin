import React, { useState } from 'react';
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

  // 🔥 NEW STATES
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [payment, setPayment] = useState<'cod' | 'upi'>('cod');

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
              {step === 'cart' && 'Your Cart'}
              {step === 'checkout' && 'Checkout'}
              {step === 'success' && 'Order Success'}
            </h2>

            <button
              onClick={onClose}
              className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
            >
              ✕
            </button>
          </div>

          {/* ================= CART ================= */}
          {step === 'cart' && (
            <>
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center mt-20 text-center">
                    <div className="text-5xl mb-4">🛒</div>
                    <p className="text-gray-500">Your cart is empty</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div
                      key={item.id}
                      className="flex gap-4 pb-4 border-b"
                    >
                      <img
                        src={item.image}
                        className="w-20 h-20 rounded-xl object-cover border"
                      />

                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {item.name}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          ₹{item.price.toLocaleString('en-IN')}
                        </p>

                        <div className="mt-3 flex items-center gap-3">
                          <button onClick={() => onDecrease(item.id)}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => onIncrease(item.id)}>+</button>

                          <button
                            onClick={() => onRemove(item.id)}
                            className="ml-auto text-sm text-red-500"
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
              <div className="border-t px-5 py-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>

                <button
                  disabled={cart.length === 0}
                  onClick={() => setStep('checkout')}
                  className="mt-4 w-full py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}

          {/* ================= CHECKOUT ================= */}
          {step === 'checkout' && (
            <div className="flex-1 overflow-y-auto px-5 py-4">

              {/* Address */}
              <input
                placeholder="Full Name"
                className="w-full border p-2 mb-3 rounded"
              />
              <input
                placeholder="Address"
                className="w-full border p-2 mb-3 rounded"
              />
              <input
                placeholder="Phone"
                className="w-full border p-2 mb-4 rounded"
              />

              {/* Payment */}
              <p className="font-medium mb-2">Payment Method</p>

              <label className="block mb-2">
                <input
                  type="radio"
                  checked={payment === 'cod'}
                  onChange={() => setPayment('cod')}
                /> Cash on Delivery
              </label>

              <label className="block mb-4">
                <input
                  type="radio"
                  checked={payment === 'upi'}
                  onChange={() => setPayment('upi')}
                /> UPI (Demo)
              </label>

              {/* QR */}
              {payment === 'upi' && (
                <div className="text-center mb-4">
                  <img
                    src="/qr.jpeg"
                    className="w-40 mx-auto"
                  />
                  <p className="text-xs text-gray-500">
                    Demo QR (no real payment)
                  </p>
                </div>
              )}

              <button
                onClick={() => setStep('success')}
                className="w-full bg-green-600 text-white py-3 rounded"
              >
                Place Order
              </button>

              <button
                onClick={() => setStep('cart')}
                className="mt-3 w-full text-gray-500"
              >
                ← Back to Cart
              </button>
            </div>
          )}

          {/* ================= SUCCESS ================= */}
          {step === 'success' && (
            <div className="flex-1 flex flex-col justify-center items-center text-center px-6">

              <div className="text-5xl mb-4">🎉</div>

              <h2 className="text-xl font-bold text-green-600">
                Order Placed Successfully!
              </h2>

              <p className="text-gray-500 mt-2">
                Your order will be delivered soon.
              </p>

              <button
                onClick={() => {
                  setStep('cart');
                  onClose();
                }}
                className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded"
              >
                Continue Shopping
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
