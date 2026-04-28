import React, { useEffect, useState } from "react";

interface HomeProps {
  onNavigate: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {

  // 🔥 Banner Images
  const images = [
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
    "https://images.unsplash.com/photo-1580910051074-3eb694886305",
    "https://images.unsplash.com/photo-1558365916-848463c5d803"
  ];

  const [index, setIndex] = useState(0);

  // 🔥 Fast smooth slider
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 2500); // faster sliding

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">

      {/* 🔥 HERO SLIDER */}
      <div className="relative w-full h-[420px] overflow-hidden">

        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            className={`absolute w-full h-full object-cover transition-opacity duration-700 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center text-white px-4">

          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Smart Shopping <span className="text-indigo-400">Redefined</span>
          </h1>

          <p className="max-w-2xl text-sm md:text-lg text-gray-200 mb-6">
            Discover products with AI-powered recommendations, tailored just for you.
          </p>

          <button
            onClick={() => onNavigate("shop")}
            className="px-8 py-3 bg-indigo-600 rounded-lg text-white font-semibold hover:bg-indigo-700 transition"
          >
            Go to Shop
          </button>

        </div>
      </div>

      {/* 🔥 FEATURES SECTION */}
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 sm:grid-cols-3 gap-8">

        <div className="p-8 bg-white shadow-lg rounded-xl hover:shadow-xl transition text-center">
          <h3 className="text-lg font-semibold mb-2">🤖 AI Powered</h3>
          <p className="text-gray-500 text-sm">
            Smart ML-based recommendations for better shopping experience
          </p>
        </div>

        <div className="p-8 bg-white shadow-lg rounded-xl hover:shadow-xl transition text-center">
          <h3 className="text-lg font-semibold mb-2">🔒 Secure</h3>
          <p className="text-gray-500 text-sm">
            Reliable and safe system with optimized backend
          </p>
        </div>

        <div className="p-8 bg-white shadow-lg rounded-xl hover:shadow-xl transition text-center">
          <h3 className="text-lg font-semibold mb-2">⚡ Fast</h3>
          <p className="text-gray-500 text-sm">
            High performance with instant AI response system
          </p>
        </div>

      </div>

      {/* 🔥 EXTRA SECTION (makes page feel full) */}
      <div className="bg-gray-100 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Why Choose Nexin?</h2>

        <p className="max-w-xl mx-auto text-gray-600 text-sm">
          Nexin combines machine learning and modern web technologies to deliver
          a seamless and personalized shopping experience like never before.
        </p>
      </div>

    </div>
  );
};
