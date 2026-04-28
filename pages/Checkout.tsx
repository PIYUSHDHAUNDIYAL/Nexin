import React, { useState } from 'react';

interface CheckoutProps {
  onNavigate: (page: string) => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ onNavigate }) => {

  const [method, setMethod] = useState("cod");

  return (
    <div className="p-10 max-w-3xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">💳 Checkout</h1>

      {/* Address */}
      <input
        type="text"
        placeholder="Enter Address"
        className="w-full border p-3 mb-4 rounded"
      />

      {/* Payment Options */}
      <div className="mb-6">

        <label className="block mb-2 font-semibold">
          Payment Method
        </label>

        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="w-full border p-3 rounded"
        >
          <option value="cod">Cash on Delivery</option>
          <option value="qr">UPI QR Payment</option>
        </select>

      </div>

      {/* QR SECTION */}
      {method === "qr" && (
        <div className="text-center mb-6">

          <p className="mb-2">Scan & Pay</p>

          <img
            src="/qr.jpeg"   // 🔥 YOUR QR IMAGE
            className="w-40 mx-auto"
          />

        </div>
      )}

      {/* PLACE ORDER */}
      <button
        onClick={() => onNavigate('success')}
        className="w-full bg-green-600 text-white py-3 rounded"
      >
        Place Order
      </button>

    </div>
  );
};
