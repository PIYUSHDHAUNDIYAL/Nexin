import React from "react";

interface HomeProps {
  onNavigate: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="bg-gray-100 min-h-screen pb-20">

      <div className="max-w-[1400px] mx-auto px-4 py-8">

        {/* ================= HERO ================= */}
        <div className="bg-gray-200 rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between relative overflow-hidden mb-8">

          {/* BIG BACK TEXT */}
          <h1 className="absolute text-[120px] md:text-[200px] font-black text-white opacity-40 left-1/2 -translate-x-1/2 pointer-events-none">
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
              className="bg-red-500 text-white px-8 py-3 rounded-full font-bold hover:bg-red-600 transition"
            >
              Shop Now
            </button>
          </div>

          {/* CENTER IMAGE */}
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/3/36/Beats_by_Dr._Dre_Studio_Over-Ear_Headphones.png"
            className="w-72 md:w-[350px] z-10 drop-shadow-2xl mt-8 md:mt-0"
          />

          {/* RIGHT */}
          <div className="hidden md:block text-right z-10">
            <h3 className="font-bold text-lg">Description</h3>
            <p className="text-sm text-gray-600 max-w-[250px]">
              Experience premium sound quality with long battery life and modern design.
            </p>
          </div>
        </div>

        {/* ================= GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

          {/* CARD */}
          <div onClick={() => onNavigate("shop")}
            className="bg-black text-white rounded-3xl p-6 relative overflow-hidden cursor-pointer group">
            
            <h1 className="absolute text-6xl font-black opacity-10">EAR</h1>

            <div className="z-10 relative">
              <p className="text-sm">Enjoy</p>
              <h2 className="text-2xl font-bold mb-3">Earphones</h2>
              <button className="bg-red-500 px-4 py-2 rounded-full text-sm">
                Browse
              </button>
            </div>

            <img
              src="https://upload.wikimedia.org/wikipedia/commons/1/1e/Apple-airpods-pro-2-2022-transparent.png"
              className="absolute right-0 bottom-0 w-40 group-hover:scale-110 transition"
            />
          </div>

          {/* CARD */}
          <div onClick={() => onNavigate("shop")}
            className="bg-yellow-400 rounded-3xl p-6 relative overflow-hidden cursor-pointer group">
            
            <h1 className="absolute text-6xl font-black opacity-20">WATCH</h1>

            <div className="z-10 relative text-white">
              <p className="text-sm">New</p>
              <h2 className="text-2xl font-bold mb-3">Smart Watch</h2>
              <button className="bg-white text-yellow-500 px-4 py-2 rounded-full text-sm">
                Browse
              </button>
            </div>

            <img
              src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_Watch_Series_7.png"
              className="absolute right-0 bottom-0 w-40 group-hover:scale-110 transition"
            />
          </div>

          {/* CARD */}
          <div onClick={() => onNavigate("shop")}
            className="bg-red-500 text-white rounded-3xl p-6 relative overflow-hidden cursor-pointer group">
            
            <h1 className="absolute text-6xl font-black opacity-10">LAPTOP</h1>

            <div className="z-10 relative">
              <p className="text-sm">Best</p>
              <h2 className="text-2xl font-bold mb-3">Laptop</h2>
              <button className="bg-white text-red-500 px-4 py-2 rounded-full text-sm">
                Browse
              </button>
            </div>

            <img
              src="https://upload.wikimedia.org/wikipedia/commons/8/82/MacBook_Pro.png"
              className="absolute right-0 bottom-0 w-48 group-hover:scale-110 transition"
            />
          </div>

        </div>

        {/* ================= BIG CARD ================= */}
        <div className="bg-white rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between shadow">

          <div>
            <p className="text-gray-500">Special Offer</p>
            <h2 className="text-4xl font-bold mb-4">Gaming Console</h2>

            <button
              onClick={() => onNavigate("shop")}
              className="bg-indigo-600 text-white px-6 py-2 rounded-full"
            >
              Explore
            </button>
          </div>

          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/52/PlayStation_5.png"
            className="w-64 mt-6 md:mt-0"
          />
        </div>

      </div>
    </div>
  );
};
