import React from 'react';

interface CartProps {
  cart: any[];
  onNavigate: (page: string) => void;
}

export const Cart: React.FC<CartProps> = ({ cart, onNavigate }) => {

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="p-10 max-w-5xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">🛒 Your Cart</h1>

      {cart.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <>
          {cart.map((item, i) => (
            <div key={i} className="flex justify-between border-b py-4">
              <p>{item.name}</p>
              <p>₹{item.price}</p>
            </div>
          ))}

          <div className="mt-6 text-xl font-bold">
            Total: ₹{total}
          </div>

          <button
            onClick={() => onNavigate('checkout')}
            className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded"
          >
            Proceed to Checkout
          </button>
        </>
      )}

    </div>
  );
};
