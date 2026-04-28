import React, { useEffect, useState } from 'react';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {

  // 🔥 FAST SLIDER IMAGES (optimized)
  const images = [
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200",
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200",
    "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=1200"
  ];

  const [index, setIndex] = useState(0);

  // 🔥 FAST AUTO SLIDE
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 2000); // ⚡ fast

    return () => clearInterval(interval);
  }, []);

  // 🔥 PRELOAD IMAGES (no lag)
  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // 🔥 SIMPLE ANALYTICS
  const visits = Number(localStorage.getItem("visits") || 0) + 1;
  localStorage.setItem("visits", String(visits));

  const viewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
  const activeUsers = Math.floor(visits / 2) + viewed.length;

  const weekly = [40, 60, 30, 80, 50, 70, 90];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* ================= SLIDER ================= */}
      <div className="relative h-[400px] overflow-hidden rounded-xl mb-16">

        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {images.map((img, i) => (
            <div
              key={i}
              className="min-w-full h-[400px] bg-cover bg-center"
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
        </div>

        {/* Overlay Content */}
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold sm:text-5xl">
              Smart Shopping <span className="text-indigo-400">Redefined</span>
            </h1>

            <button
              onClick={() => onNavigate('shop')}
              className="mt-6 px-6 py-3 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
            >
              Go to Shop
            </button>
          </div>
        </div>

      </div>

      {/* ================= ANALYTICS ================= */}
      <div className="mb-16 bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-6">📊 User Activity</h2>

        <div className="grid grid-cols-3 gap-6 text-center mb-6">

          <div className="p-4 bg-gray-50 rounded">
            <p className="text-2xl font-bold text-indigo-600">{visits}</p>
            <p className="text-sm text-gray-500">Total Visits</p>
          </div>

          <div className="p-4 bg-gray-50 rounded">
            <p className="text-2xl font-bold text-indigo-600">{viewed.length}</p>
            <p className="text-sm text-gray-500">Recently Viewed</p>
          </div>

          <div className="p-4 bg-gray-50 rounded">
            <p className="text-2xl font-bold text-indigo-600">{activeUsers}</p>
            <p className="text-sm text-gray-500">Active Users</p>
          </div>

        </div>

        {/* 🔥 CLEAN GRAPH */}
        <div>
          <p className="text-sm text-gray-500 mb-3">Weekly Activity</p>

          <div className="flex items-end gap-3 h-32">
            {weekly.map((val, i) => (
              <div key={i} className="flex flex-col items-center">

                <div
                  className="w-8 rounded-lg bg-indigo-500 hover:scale-110 transition"
                  style={{ height: `${val}%` }}
                ></div>

                <span className="text-xs text-gray-400 mt-1">
                  {["M","T","W","T","F","S","S"][i]}
                </span>

              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= FEATURES ================= */}
      <div className="grid grid-cols-3 gap-6 text-center">

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
