import React, { useEffect, useState } from 'react';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {

  // 🔥 Background images
  const images = [
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8"
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

      {/* ================= Hero Section with Slider ================= */}
      <div
        className="relative h-[500px] flex items-center justify-center text-center rounded-xl mb-20 overflow-hidden"
        style={{
          backgroundImage: `url(${images[index]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "background-image 0.7s ease-in-out"
        }}
      >

        {/* 🔥 Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>

        {/* 🔥 Content */}
        <div className="relative z-10 max-w-3xl text-white">

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            <span className="block xl:inline">Smart Shopping</span>{' '}
            <span className="block text-indigo-400 xl:inline">Redefined</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-gray-200">
            Discover products with AI-powered recommendations, personalized just
            for you.
          </p>

          <div className="mt-10 flex justify-center">
            <button
              onClick={() => onNavigate('shop')}
              className="px-8 py-4 bg-indigo-600 text-white rounded-md text-base font-medium hover:bg-indigo-700 transition"
            >
              Go to Shop
            </button>
          </div>

        </div>
      </div>

      {/* ================= Trust Badges ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        <div className="p-8 bg-gray-50 rounded-xl">
          <h3 className="font-semibold text-gray-900 text-lg">🤖 AI Powered</h3>
          <p className="text-sm text-gray-500 mt-3">
            Smart recommendations using machine learning
          </p>
        </div>

        <div className="p-8 bg-gray-50 rounded-xl">
          <h3 className="font-semibold text-gray-900 text-lg">🔒 Secure</h3>
          <p className="text-sm text-gray-500 mt-3">
            Safe and reliable shopping experience
          </p>
        </div>

        <div className="p-8 bg-gray-50 rounded-xl">
          <h3 className="font-semibold text-gray-900 text-lg">⚡ Fast</h3>
          <p className="text-sm text-gray-500 mt-3">
            Optimized performance with instant feedback
          </p>
        </div>
      </div>

    </div>
  );
};
