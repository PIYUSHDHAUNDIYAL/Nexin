import React, { useEffect, useState } from 'react';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {

  const images = [
  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1600",
  "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1600",
  "https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=1600",
  "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=1600"
];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* ================= HERO ================= */}
      <div
        className="relative h-[450px] flex items-center justify-center text-center rounded-xl mb-16 overflow-hidden"
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

      {/* ================= CATEGORY CARDS (UPDATED) ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">

        <div className="bg-black text-white p-5 rounded-xl">
          <h3 className="font-bold">Earphones</h3>
          <p className="text-xs opacity-70">Enjoy music</p>
        </div>

        <div className="bg-yellow-400 p-5 rounded-xl">
          <h3 className="font-bold">Smart Watch</h3>
          <p className="text-xs">Track fitness</p>
        </div>

        <div className="bg-red-500 text-white p-5 rounded-xl">
          <h3 className="font-bold">Laptop</h3>
          <p className="text-xs">Performance</p>
        </div>

        {/* 🔥 NEW */}
        <div className="bg-indigo-500 text-white p-5 rounded-xl">
          <h3 className="font-bold">Mobile</h3>
          <p className="text-xs">Latest phones</p>
        </div>

        <div className="bg-green-500 text-white p-5 rounded-xl">
          <h3 className="font-bold">Office</h3>
          <p className="text-xs">Work setup</p>
        </div>

        <div className="bg-gray-800 text-white p-5 rounded-xl">
          <h3 className="font-bold">Gaming</h3>
          <p className="text-xs">Pro gear</p>
        </div>

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
