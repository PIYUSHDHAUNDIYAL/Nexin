import React from 'react';
import { motion } from 'framer-motion';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="bg-white min-h-screen pb-24 font-sans">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* ================= HERO SECTION ================= */}
        <div className="bg-[#ebebeb] rounded-3xl p-8 lg:p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between min-h-[600px] mb-8 shadow-sm">
          
          {/* Background Text Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <h1 className="text-[8rem] lg:text-[14rem] font-black text-white selection:bg-transparent tracking-tighter mix-blend-overlay opacity-80">
              HEADPHONE
            </h1>
          </div>

          {/* Left Content */}
          <div className="relative z-10 w-full md:w-1/3 mb-10 md:mb-0">
            <h3 className="text-2xl font-bold text-gray-800">Beats Solo</h3>
            <h2 className="text-6xl lg:text-7xl font-black text-gray-900 mb-8 leading-tight">
              Wireless
            </h2>
            <button 
              onClick={() => onNavigate('shop')}
              className="bg-[#f42c37] text-white px-10 py-3 rounded-full font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
            >
              Shop
            </button>
          </div>

          {/* Center Image */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative z-20 w-full md:w-1/3 flex justify-center"
          >
            <img 
              src="images\headphones12.png" 
              alt="Headphones" 
              // mix-blend-multiply added to remove white backgrounds from future JPGs
              className="w-full max-w-[400px] object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.4)] scale-110 lg:scale-125 z-20 mix-blend-multiply"
            />
          </motion.div>

          {/* Right Content */}
          <div className="relative z-10 w-full md:w-1/3 text-right hidden md:block">
            <h4 className="font-bold text-gray-900 text-lg">Description</h4>
            <p className="text-sm text-gray-500 mt-2 max-w-[250px] ml-auto font-medium leading-relaxed">
              The headphones and durable battery wireless over ear headset ranges and 60hrs of battery health.
            </p>
          </div>
        </div>

        {/* ================= BENTO GRID 1 (3 Cols) ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          
          {/* Card 1 */}
          <div className="bg-[#333333] rounded-3xl p-8 relative overflow-hidden h-[320px] flex flex-col justify-end shadow-md hover:shadow-xl transition-shadow cursor-pointer group" onClick={() => onNavigate('shop')}>
            <h1 className="absolute top-1/2 -translate-y-1/2 left-4 text-7xl font-black text-white/5 pointer-events-none select-none transition-transform group-hover:scale-105">EARPHONE</h1>
            <div className="relative z-10 text-white w-2/3">
              <p className="text-sm font-medium opacity-80">Enjoy</p>
              <h3 className="text-3xl font-black mb-4 leading-tight">With<br/>EARPHONE</h3>
              <button className="bg-[#f42c37] text-white px-6 py-2 rounded-full text-sm font-bold shadow-md">Browse</button>
            </div>
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/1/1e/Apple-airpods-pro-2-2022-transparent.png" 
              alt="Earphones" 
              className="absolute -right-4 top-1/2 -translate-y-1/2 w-56 drop-shadow-2xl object-contain group-hover:-translate-y-6 transition-transform duration-500 mix-blend-multiply"
            />
          </div>

          {/* Card 2 */}
          <div className="bg-[#fdc62e] rounded-3xl p-8 relative overflow-hidden h-[320px] flex flex-col justify-end shadow-md hover:shadow-xl transition-shadow cursor-pointer group" onClick={() => onNavigate('shop')}>
            <h1 className="absolute top-1/2 -translate-y-1/2 left-4 text-7xl font-black text-white/20 pointer-events-none select-none transition-transform group-hover:scale-105">WATCH</h1>
            <div className="relative z-10 text-white w-2/3">
              <p className="text-sm font-medium opacity-90">New</p>
              <h3 className="text-3xl font-black mb-4 leading-tight">Wear<br/>Fitness Watch</h3>
              <button className="bg-white text-[#fdc62e] px-6 py-2 rounded-full text-sm font-bold shadow-md">Browse</button>
            </div>
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_Watch_Series_7_Midnight_Aluminum_Case_with_Midnight_Sport_Band_transparent.png" 
              alt="Watch" 
              className="absolute -right-12 top-1/2 -translate-y-1/2 w-72 drop-shadow-2xl object-contain group-hover:-translate-y-6 transition-transform duration-500 mix-blend-multiply"
            />
          </div>

          {/* Card 3 */}
          <div className="bg-[#f42c37] rounded-3xl p-8 relative overflow-hidden h-[320px] flex flex-col justify-end shadow-md hover:shadow-xl transition-shadow cursor-pointer group" onClick={() => onNavigate('shop')}>
            <h1 className="absolute top-1/2 -translate-y-1/2 left-4 text-7xl font-black text-white/10 pointer-events-none select-none transition-transform group-hover:scale-105">LAPTOP</h1>
            <div className="relative z-10 text-white w-2/3">
              <p className="text-sm font-medium opacity-90">Twin</p>
              <h3 className="text-3xl font-black mb-4 leading-tight">With<br/>LAPTOP</h3>
              <button className="bg-white text-[#f42c37] px-6 py-2 rounded-full text-sm font-bold shadow-md">Browse</button>
            </div>
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/8/82/MacBook_Pro_16_inch_with_M1_Pro_or_M1_Max_chip_transparent.png" 
              alt="Laptop" 
              className="absolute -right-24 top-1/2 -translate-y-1/2 w-[400px] drop-shadow-2xl object-contain group-hover:-translate-y-6 transition-transform duration-500 mix-blend-multiply"
            />
          </div>
        </div>

        {/* ================= BENTO GRID 2 (Asymmetrical) ================= */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-24">
          
          {/* Card 4 (Double Width) */}
          <div className="md:col-span-2 bg-[#e5e5e5] rounded-3xl p-8 relative overflow-hidden h-[320px] flex flex-col justify-end shadow-md hover:shadow-xl transition-shadow cursor-pointer group" onClick={() => onNavigate('shop')}>
            <h1 className="absolute top-1/2 -translate-y-1/2 left-4 text-8xl font-black text-white/70 pointer-events-none select-none transition-transform group-hover:scale-105">CONSOLE</h1>
            <div className="relative z-10 text-gray-900 w-1/2">
              <p className="text-sm font-bold text-gray-500">Best</p>
              <h3 className="text-4xl font-black mb-4 leading-tight">Gaming<br/>CONSOLE</h3>
              <button className="bg-[#f42c37] text-white px-6 py-2 rounded-full text-sm font-bold shadow-md">Browse</button>
            </div>
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/5/52/PlayStation_5_with_DualSense_Controller.png" 
              alt="PS5" 
              className="absolute right-4 -bottom-4 w-64 drop-shadow-[0_20px_20px_rgba(0,0,0,0.3)] object-contain group-hover:-translate-y-4 transition-transform duration-500 mix-blend-multiply"
            />
          </div>

          {/* Card 5 */}
          <div className="md:col-span-1 bg-[#2dcc70] rounded-3xl p-8 relative overflow-hidden h-[320px] flex flex-col justify-end shadow-md hover:shadow-xl transition-shadow cursor-pointer group" onClick={() => onNavigate('shop')}>
            <h1 className="absolute top-1/2 -translate-y-1/2 left-2 text-6xl font-black text-white/10 pointer-events-none select-none transition-transform group-hover:scale-105">OCULUS</h1>
            <div className="relative z-10 text-white">
              <p className="text-sm font-medium opacity-90">Play</p>
              <h3 className="text-3xl font-black mb-4 leading-tight">Game<br/>OCULUS</h3>
              <button className="bg-white text-[#2dcc70] px-6 py-2 rounded-full text-sm font-bold shadow-md">Browse</button>
            </div>
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/e/e3/Oculus-Rift-CV1-Headset-Front.png" 
              alt="VR Headset" 
              className="absolute -right-8 -bottom-4 w-56 drop-shadow-2xl object-contain group-hover:-translate-y-4 transition-transform duration-500 mix-blend-multiply"
            />
          </div>

          {/* Card 6 */}
          <div className="md:col-span-1 bg-[#1376f4] rounded-3xl p-8 relative overflow-hidden h-[320px] flex flex-col justify-end shadow-md hover:shadow-xl transition-shadow cursor-pointer group" onClick={() => onNavigate('shop')}>
            <h1 className="absolute top-1/2 -translate-y-1/2 left-2 text-6xl font-black text-white/10 pointer-events-none select-none transition-transform group-hover:scale-105">SPEAKER</h1>
            <div className="relative z-10 text-white">
              <p className="text-sm font-medium opacity-90">New</p>
              <h3 className="text-3xl font-black mb-4 leading-tight">Amazon<br/>SPEAKER</h3>
              <button className="bg-white text-[#1376f4] px-6 py-2 rounded-full text-sm font-bold shadow-md">Browse</button>
            </div>
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/8/88/Amazon_Echo_Plus_transparent.png" 
              alt="Speaker" 
              className="absolute -right-4 -bottom-8 w-40 drop-shadow-2xl object-contain group-hover:-translate-y-4 transition-transform duration-500 mix-blend-multiply"
            />
          </div>

        </div>

        {/* ================= BOTTOM PROMO BANNER ================= */}
        <div className="mt-40 mb-10 bg-[#f42c37] rounded-3xl p-8 md:p-16 relative flex flex-col md:flex-row items-center justify-between min-h-[250px] shadow-lg">
          
          {/* Overlapping Headphone Image */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-32 z-20 w-80 lg:w-[400px]">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/3/36/Beats_by_Dr._Dre_Studio_Over-Ear_Headphones.png" 
              alt="Red Headphones Promo" 
              className="w-full drop-shadow-[0_30px_30px_rgba(0,0,0,0.5)] object-contain mix-blend-multiply"
            />
          </div>

          {/* Left Text */}
          <div className="relative z-10 text-white text-center md:text-left mb-10 md:mb-0 w-full md:w-1/3">
            <p className="text-sm font-bold mb-2 opacity-90">20% off</p>
            <h1 className="text-6xl lg:text-8xl font-black leading-none tracking-tighter">
              FINE<br/>SMILE
            </h1>
            <p className="text-sm mt-4 font-medium opacity-90">March 03 To April 05</p>
          </div>

          {/* Right Text */}
          <div className="relative z-10 text-white text-center md:text-right w-full md:w-1/3 mt-32 md:mt-0">
            <p className="text-sm font-bold mb-2 opacity-90">Beats Solo Air</p>
            <h2 className="text-4xl lg:text-5xl font-black mb-4">Summer Sale</h2>
            <p className="text-sm max-w-[280px] mx-auto md:ml-auto md:mr-0 opacity-80 mb-6 font-medium leading-relaxed">
              The headphones and durable battery wireless over ear headset ranges and 60hrs of battery health.
            </p>
            <button 
              onClick={() => onNavigate('shop')}
              className="bg-white text-[#f42c37] px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Shop Now
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
