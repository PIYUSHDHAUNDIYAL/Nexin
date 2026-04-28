import React, { useEffect, useState } from 'react';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {

  // 🔥 Slider images (external)
  const images = [
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
    "https://images.unsplash.com/photo-1580910051074-3eb694886505",
    "https://images.unsplash.com/photo-1585386959984-a41552262c4b"
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000); // 🔥 faster sliding
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* ================= HERO SLIDER ================= */}
      <div
        className="relative h-[450px] flex items-center justify-center text-center rounded-xl mb-16 overflow-hidden transition-all duration-700"
        style={{
          backgroundImage: `url(${images[index]})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 text-white">
          <h1 className="text-4xl font-bold sm:text-5xl">
            Smart Shopping <span className="text-indigo-400">Redefined</span>
          </h1>

          <p className="mt-4 text-gray-200">
            Discover trending products with AI recommendations
          </p>

          <button
            onClick={() => onNavigate('shop')}
            className="mt-6 px-6 py-3 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
          >
            Shop Now
          </button>
        </div>
      </div>

      {/* ================= CATEGORY CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">

        <div className="bg-black text-white p-6 rounded-xl relative overflow-hidden">
          <h3 className="text-lg font-bold">Earphones</h3>
          <p className="text-sm opacity-70">Enjoy music</p>
        </div>

        <div className="bg-yellow-400 p-6 rounded-xl">
          <h3 className="text-lg font-bold">Smart Watch</h3>
          <p className="text-sm">Track fitness</p>
        </div>

        <div className="bg-red-500 text-white p-6 rounded-xl">
          <h3 className="text-lg font-bold">Laptop</h3>
          <p className="text-sm">Powerful performance</p>
        </div>

      </div>

      {/* ================= FEATURED SECTION ================= */}
      <div className="bg-white p-6 rounded-xl shadow flex flex-col sm:flex-row items-center justify-between">

        <div>
          <p className="text-sm text-gray-400">Special Offer</p>
          <h2 className="text-2xl font-bold">Gaming Console</h2>
          <button
            onClick={() => onNavigate('shop')}
            className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded-lg"
          >
            Explore
          </button>
        </div>

        <img
          src="https://images.unsplash.com/photo-1606813907291-d86efa9b94db"
          className="w-40 mt-4 sm:mt-0 rounded-lg"
        />

      </div>

      {/* ================= FEATURES ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center mt-16">

        <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
          <div className="text-3xl mb-2">🤖</div>
          <h3 className="font-semibold">AI Powered</h3>
          <p className="text-sm text-gray-500">Smart ML recommendations</p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
          <div className="text-3xl mb-2">🔒</div>
          <h3 className="font-semibold">Secure</h3>
          <p className="text-sm text-gray-500">Safe system</p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
          <div className="text-3xl mb-2">⚡</div>
          <h3 className="font-semibold">Fast</h3>
          <p className="text-sm text-gray-500">Optimized performance</p>
        </div>

      </div>

    </div>
  );
};
