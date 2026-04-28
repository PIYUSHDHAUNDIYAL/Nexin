import React, { useEffect, useState } from 'react';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {

  // 🔥 Slider images
  const images = [
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
    "https://images.unsplash.com/photo-1580910051074-3eb694886505",
    "https://images.unsplash.com/photo-1585386959984-a41552262c4b",
    "https://images.unsplash.com/photo-1593642632823-8f785ba67e45"
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // 🔥 Simple analytics (lightweight)
  const visits = Number(localStorage.getItem("visits") || 0) + 1;
  localStorage.setItem("visits", String(visits));

  const viewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* ================= HERO SLIDER ================= */}
      <div
        className="relative h-[500px] flex items-center justify-center text-center rounded-xl mb-16 overflow-hidden"
        style={{
          backgroundImage: `url(${images[index]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "all 1s ease-in-out"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>

        <div className="relative z-10 max-w-3xl text-white">
          <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
            Smart Shopping <span className="text-indigo-400">Redefined</span>
          </h1>

          <p className="mt-6 text-lg text-gray-200">
            Discover products with AI-powered recommendations tailored for you
          </p>

          <button
            onClick={() => onNavigate('shop')}
            className="mt-8 px-8 py-4 bg-indigo-600 rounded-lg hover:bg-indigo-700 hover:scale-105 transition"
          >
            Go to Shop
          </button>
        </div>
      </div>

      {/* ================= ANALYTICS ================= */}
      <div className="mb-16 bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">📊 User Activity</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">

          <div className="p-4 bg-gray-50 rounded">
            <p className="text-2xl font-bold text-indigo-600">{visits}</p>
            <p className="text-sm text-gray-500">Total Visits</p>
          </div>

          <div className="p-4 bg-gray-50 rounded">
            <p className="text-2xl font-bold text-indigo-600">{viewed.length}</p>
            <p className="text-sm text-gray-500">Recently Viewed</p>
          </div>

          <div className="p-4 bg-gray-50 rounded">
            <p className="text-2xl font-bold text-indigo-600">
              {Math.floor(Math.random() * 50 + 10)}
            </p>
            <p className="text-sm text-gray-500">Active Users</p>
          </div>

        </div>

        {/* 🔥 Simple graph */}
        <div className="mt-6">
          <p className="text-sm text-gray-500 mb-2">Weekly Activity</p>
          <div className="flex items-end gap-2 h-24">
            {[40, 60, 30, 80, 50, 70, 90].map((val, i) => (
              <div
                key={i}
                className="bg-indigo-500 w-6 rounded"
                style={{ height: `${val}%` }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= FEATURES ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        {[
          { icon: "🤖", title: "AI Powered", desc: "Smart ML recommendations" },
          { icon: "🔒", title: "Secure", desc: "Safe and reliable system" },
          { icon: "⚡", title: "Fast", desc: "Optimized performance" }
        ].map((item, i) => (
          <div
            key={i}
            className="p-8 bg-white rounded-xl shadow hover:shadow-xl transition hover:-translate-y-1"
          >
            <div className="text-4xl mb-4">{item.icon}</div>
            <h3 className="font-semibold text-gray-900 text-lg">{item.title}</h3>
            <p className="text-sm text-gray-500 mt-2">{item.desc}</p>
          </div>
        ))}
      </div>

    </div>
  );
};
