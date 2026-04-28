import React, { useState } from 'react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemove: (id: string) => void;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  clearCart: () => void; // ✅ NEW
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onRemove,
  onIncrease,
  onDecrease,
  clearCart // ✅ NEW
}) => {

  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [payment, setPayment] = useState<'cod' | 'upi'>('cod');

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

  // ================= INPUT =================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ================= VALIDATION =================
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
        className={`absolute inset-0 bg-black/40 transition ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform transition ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">

          {/* HEADER */}
          <div className="flex justify-between p-4 border-b">
            <h2 className="font-bold">
              {step === 'cart' && 'Your Cart'}
              {step === 'checkout' && 'Checkout'}
              {step === 'success' && 'Order Success'}
            </h2>
            <button onClick={onClose}>✕</button>
          </div>

          {/* ================= CART ================= */}
          {step === 'cart' && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">

                {cart.length === 0 ? (
                  <p className="text-center text-gray-500 mt-20">
                    Cart is empty
                  </p>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex gap-3 border-b pb-3">

                      <img src={item.image} className="w-20 h-20 rounded object-cover" />

                      <div className="flex-1">
                        <p>{item.name}</p>
                        <p>₹{item.price}</p>

                        <div className="flex gap-2 mt-2 items-center">
                          <button onClick={() => onDecrease(item.id)}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => onIncrease(item.id)}>+</button>

                          <button
                            onClick={() => onRemove(item.id)}
                            className="ml-auto text-red-500"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                    </div>
                  ))
                )}

              </div>

              <div className="p-4 border-t">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>

                <button
                  onClick={() => setStep('checkout')}
                  className="w-full bg-indigo-600 text-white mt-3 py-2 rounded"
                >
                  Checkout
                </button>
              </div>
            </>
          )}

          {/* ================= CHECKOUT ================= */}
          {step === 'checkout' && (
            <div className="p-4 space-y-2">

              <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border w-full p-2"/>
              <p className="text-red-500 text-xs">{errors.name}</p>

              <input name="address" placeholder="Address" value={form.address} onChange={handleChange} className="border w-full p-2"/>
              <p className="text-red-500 text-xs">{errors.address}</p>

              <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="border w-full p-2"/>
              <p className="text-red-500 text-xs">{errors.phone}</p>

              <p className="mt-2">Payment</p>

              <label>
                <input type="radio" checked={payment === 'cod'} onChange={() => setPayment('cod')} />
                COD
              </label>

              <label className="ml-4">
                <input type="radio" checked={payment === 'upi'} onChange={() => setPayment('upi')} />
                UPI
              </label>

              {payment === 'upi' && (
                <img src="/qr.jpeg" className="w-32 mx-auto mt-2" />
              )}

              <button
                onClick={() => {
                  if (validateForm()) {
                    clearCart(); // ✅ CLEAR CART
                    setForm({ name: '', address: '', phone: '' }); // ✅ RESET FORM
                    setStep('success');
                  }
                }}
                className="w-full bg-green-600 text-white py-2 mt-3 rounded"
              >
                Place Order
              </button>

              <button onClick={() => setStep('cart')} className="w-full mt-2 text-gray-500">
                Back
              </button>

            </div>
          )}

          {/* ================= SUCCESS ================= */}
          {step === 'success' && (
            <div className="flex flex-col justify-center items-center h-full">

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
                Continue Shopping
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
