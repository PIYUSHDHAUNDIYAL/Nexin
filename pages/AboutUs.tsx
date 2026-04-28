import React from 'react';
import { motion } from 'framer-motion';

export const AboutUs: React.FC = () => {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-gray-900 mb-4">OUR <span className="text-[#f42c37]">STORY</span></h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">Redefining how you shop for premium electronics through artificial intelligence.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-[#1376f4] p-12 rounded-3xl text-white flex flex-col justify-center min-h-[400px] relative overflow-hidden">
          <h1 className="absolute -right-10 -bottom-10 text-[12rem] font-black text-white/10 select-none">VISION</h1>
          <h2 className="text-4xl font-black mb-6 relative z-10">The Vision</h2>
          <p className="text-lg relative z-10 leading-relaxed font-medium">
            SmartShop AI was founded with a simple goal: remove the clutter from online shopping. We believe that finding the perfect tech shouldn't require hours of research. Our AI engine does the heavy lifting, matching your specific needs with the world's best electronics.
          </p>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-gray-100 p-12 rounded-3xl flex flex-col justify-center min-h-[400px]">
          <h2 className="text-4xl font-black text-gray-900 mb-6">Why Choose Us?</h2>
          <ul className="space-y-4">
            <li className="flex items-center gap-4 text-lg font-bold text-gray-700">
              <span className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm">🤖</span> AI-Powered Matching
            </li>
            <li className="flex items-center gap-4 text-lg font-bold text-gray-700">
              <span className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm">⚡</span> Lightning Fast Checkout
            </li>
            <li className="flex items-center gap-4 text-lg font-bold text-gray-700">
              <span className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm">🛡️</span> Premium Quality Guarantee
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};