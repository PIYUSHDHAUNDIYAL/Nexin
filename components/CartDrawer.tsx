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

  // 🔥 STATES
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [payment, setPayment] = useState<'cod' | 'upi'>('cod');

  // 🔥 FORM STATE
  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    address: '',
    phone: ''
  });

  // 🔥 HANDLE INPUT
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 🔥 VALIDATION
  const validateForm = () => {
    let valid = true;
    let newErrors = { name: '', address: '', phone: '' };

    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    if (!form.address.trim()) {
      newErrors.address = 'Address is required';
      valid = false;
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'Phone is required';
      valid = false;
    } else if (!/^[0-9]{10}$/.test(form.phone)) {
      newErrors.phone = 'Enter valid 10 digit number';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? '' : 'pointer-events-none'}`}>
      
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h2 className="text-lg font-bold">
              {step === 'cart' && 'Your Cart'}
              {step === 'checkout' && 'Checkout'}
              {step === 'success' && 'Order Success'}
            </h2>

            <button onClick={onClose}>✕</button>
          </div>

          {/* ================= CART ================= */}
          {step === 'cart' && (
            <>
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
                {cart.length === 0 ? (
                  <p className="text-center mt-20 text-gray-500">
                    Your cart is empty
                  </p>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex gap-4 border-b pb-4">
                      <img src={item.image} className="w-20 h-20 rounded object-cover" />

                      <div className="flex-1">
                        <h3>{item.name}</h3>
                        <p>₹{item.price}</p>

                        <div className="flex gap-2 mt-2">
                          <button onClick={() => onDecrease(item.id)}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => onIncrease(item.id)}>+</button>
                          <button onClick={() => onRemove(item.id)} className="text-red-500 ml-auto">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t p-4">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>

                <button
                  onClick={() => setStep('checkout')}
                  className="mt-3 w-full bg-indigo-600 text-white py-2 rounded"
                >
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}

          {/* ================= CHECKOUT ================= */}
          {step === 'checkout' && (
            <div className="p-5 space-y-2">

              <input
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              <p className="text-red-500 text-xs">{errors.name}</p>

              <input
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              <p className="text-red-500 text-xs">{errors.address}</p>

              <input
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              <p className="text-red-500 text-xs">{errors.phone}</p>

              {/* Payment */}
              <p className="mt-3 font-medium">Payment</p>

              <label>
                <input
                  type="radio"
                  checked={payment === 'cod'}
                  onChange={() => setPayment('cod')}
                /> COD
              </label>

              <label className="ml-4">
                <input
                  type="radio"
                  checked={payment === 'upi'}
                  onChange={() => setPayment('upi')}
                /> UPI
              </label>

              {/* QR */}
              {payment === 'upi' && (
                <img src="/qr.jpeg" className="w-32 mx-auto mt-3" />
              )}

              <button
                onClick={() => {
                  if (validateForm()) {
                    setStep('success');
                  }
                }}
                className="w-full bg-green-600 text-white py-2 mt-4 rounded"
              >
                Place Order
              </button>

              <button
                onClick={() => setStep('cart')}
                className="text-gray-500 w-full mt-2"
              >
                Back
              </button>
            </div>
          )}

          {/* ================= SUCCESS ================= */}
          {step === 'success' && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <h2 className="text-green-600 text-xl font-bold">
                Order Placed Successfully 🎉
              </h2>

              <button
                onClick={() => {
                  setStep('cart');
                  onClose();
                }}
                className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded"
              >
                Continue
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
