import React from "react";

interface HomeProps {
  onNavigate: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {

  // 🔥 Random high-quality images
  const images = {
    hero: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800",
    earphone: "https://images.unsplash.com/photo-1585386959984-a415522316f1?w=400",
    watch: "https://images.unsplash.com/photo-1519744346363-d1c7c3f2cdb2?w=400",
    laptop: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    console: "https://images.unsplash.com/photo-1605902711622-cfb43c4437d1?w=500"
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-16">

      <div className="max-w-[1400px] mx-auto px-4 py-8">

        {/* ================= HERO ================= */}
        <div className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-3xl p-8 md:p-14 flex flex-col md:flex-row items-center justify-between relative overflow-hidden mb-10 shadow">

          {/* BIG TEXT */}
          <h1 className="absolute text-[100px] md:text-[180px] font-black text-white opacity-30 left-1/2 -translate-x-1/2 pointer-events-none">
            NEXIN
          </h1>

          {/* LEFT */}
          <div className="z-10 max-w-lg">
            <p className="text-gray-600 font-semibold mb-2">Premium Experience</p>

            <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight">
              Smart Shopping <br />
              <span className="text-indigo-600">With AI</span>
            </h1>

            <p className="text-gray-600 text-sm mb-6">
              Discover personalized products, powered by machine learning
              and real-time recommendations.
            </p>

            <button
              onClick={() => onNavigate("shop")}
              className="bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 transition shadow"
            >
              Explore Now
            </button>
          </div>

          {/* HERO IMAGE */}
          <img
            src={images.hero}
            className="w-72 md:w-[360px] rounded-2xl shadow-xl mt-8 md:mt-0 object-cover hover:scale-105 transition duration-500"
          />

          {/* RIGHT */}
          <div className="hidden md:block text-right z-10 max-w-[250px]">
            <h3 className="font-bold text-lg mb-2">Why Nexin?</h3>
            <p className="text-sm text-gray-600">
              AI recommendations + modern UI = better shopping experience.
            </p>
          </div>
        </div>

        {/* ================= CATEGORY GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          {/* EARPHONE */}
          <div
            onClick={() => onNavigate("shop")}
            className="bg-black text-white rounded-2xl p-6 relative overflow-hidden cursor-pointer group hover:shadow-xl transition"
          >
            <h1 className="absolute text-6xl font-black opacity-10">EAR</h1>

            <div className="z-10 relative">
              <p className="text-sm">Enjoy</p>
              <h2 className="text-xl font-bold mb-3">Earphones</h2>
            </div>

            <img
              src={images.earphone}
              className="absolute right-0 bottom-0 w-36 rounded-lg group-hover:scale-110 transition"
            />
          </div>

          {/* WATCH */}
          <div
            onClick={() => onNavigate("shop")}
            className="bg-yellow-400 rounded-2xl p-6 relative overflow-hidden cursor-pointer group hover:shadow-xl transition"
          >
            <h1 className="absolute text-6xl font-black opacity-20">WATCH</h1>

            <div className="z-10 relative text-white">
              <p className="text-sm">New</p>
              <h2 className="text-xl font-bold mb-3">Smart Watch</h2>
            </div>

            <img
              src={images.watch}
              className="absolute right-0 bottom-0 w-36 rounded-lg group-hover:scale-110 transition"
            />
          </div>

          {/* LAPTOP */}
          <div
            onClick={() => onNavigate("shop")}
            className="bg-red-500 text-white rounded-2xl p-6 relative overflow-hidden cursor-pointer group hover:shadow-xl transition"
          >
            <h1 className="absolute text-6xl font-black opacity-10">LAPTOP</h1>

            <div className="z-10 relative">
              <p className="text-sm">Best</p>
              <h2 className="text-xl font-bold mb-3">Laptop</h2>
            </div>

            <img
              src={images.laptop}
              className="absolute right-0 bottom-0 w-40 rounded-lg group-hover:scale-110 transition"
            />
          </div>

        </div>

        {/* ================= FEATURE STRIP ================= */}
        <div className="grid grid-cols-3 gap-4 mb-10 text-center">

          <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
            <p className="text-xl">🤖</p>
            <p className="text-sm font-semibold">AI Powered</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
            <p className="text-xl">🔒</p>
            <p className="text-sm font-semibold">Secure</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
            <p className="text-xl">⚡</p>
            <p className="text-sm font-semibold">Fast</p>
          </div>

        </div>

        {/* ================= BIG OFFER ================= */}
        <div className="bg-white rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between shadow hover:shadow-lg transition">

          <div>
            <p className="text-gray-500 text-sm">Special Offer</p>
            <h2 className="text-3xl font-bold mb-3">Gaming Console</h2>

            <button
              onClick={() => onNavigate("shop")}
              className="bg-indigo-600 text-white px-6 py-2 rounded-full"
            >
              Explore
            </button>
          </div>

          <img
            src={images.console}
            className="w-56 mt-6 md:mt-0 rounded-xl shadow"
          />
        </div>

      </div>
    </div>
  );
};
