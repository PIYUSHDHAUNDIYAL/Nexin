import React from 'react';
import { motion } from 'framer-motion';

export const ContactUs: React.FC = () => {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900 rounded-[3rem] p-8 md:p-16 flex flex-col md:flex-row gap-12 text-white">
        
        {/* Info Side */}
        <div className="md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6">HELLO.</h1>
            <p className="text-xl text-gray-400 mb-12">
              Got a question about an order, a product, or just want to say hi? We&apos;d love to hear from you.
            </p>
          </div>
          
          <div className="space-y-6">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Email</p>
              <p className="text-2xl font-bold">support@smartshopai.com</p>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Phone</p>
              <p className="text-2xl font-bold">+91 98765 43210</p>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="md:w-1/2 bg-white rounded-[2rem] p-8 md:p-12 text-gray-900">
          <h3 className="text-3xl font-black mb-8">Send a Message</h3>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Your Name</label>
              <input type="text" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl outline-none focus:border-gray-900 transition-colors" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <input type="email" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl outline-none focus:border-gray-900 transition-colors" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
              <textarea rows={4} className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl outline-none focus:border-gray-900 transition-colors resize-none" placeholder="How can we help?" />
            </div>
            <button type="button" className="w-full bg-[#f42c37] text-white font-bold py-4 rounded-xl hover:bg-red-600 active:scale-95 transition-all">
              Send Message
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};