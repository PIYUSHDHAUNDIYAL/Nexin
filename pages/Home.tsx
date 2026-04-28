import React from "react";

interface HomeProps {
  onNavigate: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {

  // 🔥 ALL IMAGES HERE (CHANGE ANYTIME)
  const images = {
    hero: "https://images.unsplash.com/photo-1518441902113-c1d6b6e0b5b3?w=800",
    earphone: "https://images.unsplash.com/photo-1585386959984-a415522316f1?w=400",
    watch: "https://images.unsplash.com/photo-1519744346363-d1c7c3f2cdb2?w=400",
    laptop: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    console: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500"
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-20">

      <div className="max-w-[1400px] mx-auto px-4 py-8">

        {/* ================= HERO ================= */}
        <div className="bg-gray-200 rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between relative overflow-hidden mb-8">

          <h1 className="absolute text-[120px] md:text-[200px] font-black text-white opacity-40 left-1/2 -translate-x-1/2">
            NEXIN
          </h1>

          {/* LEFT */}
          <div className="z-10">
            <p className="text-gray-700 font-semibold">Premium</p>
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              Smart <br /> Shopping
            </h1>

            <button
              onClick={() => onNavigate("shop")}
              className="bg-red-500 text-white px-8 py-3 rounded-full"
            >
              Shop Now
            </button>
          </div>

          {/* HERO IMAGE */}
          <img
            src={images.hero}
            className="w-72 md:w-[350px] z-10 drop-shadow-2xl mt-8 md:mt-0 rounded-xl object-cover"
          />

          {/* RIGHT */}
          <div className="hidden md:block text-right z-10">
            <h3 className="font-bold text-lg">Description</h3>
            <p className="text-sm text-gray-600 max-w-[250px]">
              Modern ecommerce UI with AI recommendations.
            </p>
          </div>
        </div>

        {/* ================= GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

          {/* EARPHONE */}
          <div onClick={() => onNavigate("shop")}
            className="bg-black text-white rounded-3xl p-6 relative overflow-hidden cursor-pointer group">
            
            <h1 className="absolute text-6xl font-black opacity-10">EAR</h1>

            <div className="z-10 relative">
              <p className="text-sm">Enjoy</p>
              <h2 className="text-2xl font-bold mb-3">Earphones</h2>
            </div>

            <img
              src={images.earphone}
              className="absolute right-0 bottom-0 w-40 group-hover:scale-110 transition"
            />
          </div>

          {/* WATCH */}
          <div onClick={() => onNavigate("shop")}
            className="bg-yellow-400 rounded-3xl p-6 relative overflow-hidden cursor-pointer group">
            
            <h1 className="absolute text-6xl font-black opacity-20">WATCH</h1>

            <div className="z-10 relative text-white">
              <p className="text-sm">New</p>
              <h2 className="text-2xl font-bold mb-3">Smart Watch</h2>
            </div>

            <img
              src={images.watch}
              className="absolute right-0 bottom-0 w-40 group-hover:scale-110 transition"
            />
          </div>

          {/* LAPTOP */}
          <div onClick={() => onNavigate("shop")}
            className="bg-red-500 text-white rounded-3xl p-6 relative overflow-hidden cursor-pointer group">
            
            <h1 className="absolute text-6xl font-black opacity-10">LAPTOP</h1>

            <div className="z-10 relative">
              <p className="text-sm">Best</p>
              <h2 className="text-2xl font-bold mb-3">Laptop</h2>
            </div>

            <img
              src={images.laptop}
              className="absolute right-0 bottom-0 w-48 group-hover:scale-110 transition"
            />
          </div>

        </div>

        {/* ================= BIG CARD ================= */}
        <div className="bg-white rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between shadow">

          <div>
            <p className="text-gray-500">Special Offer</p>
            <h2 className="text-4xl font-bold mb-4">Gaming Console</h2>
          </div>

          <img
            src={images.console}
            className="w-64 mt-6 md:mt-0 rounded-xl"
          />
        </div>

      </div>
    </div>
  );
};
