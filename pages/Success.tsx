import React from 'react';

export const Success = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center">

      <h1 className="text-3xl font-bold text-green-600">
        ✅ Order Placed Successfully
      </h1>

      <p className="mt-2 text-gray-500">
        Thank you for shopping!
      </p>

    </div>
  );
};
