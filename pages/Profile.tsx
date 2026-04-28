import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Temporary Mock Data for UI presentation
const MOCK_USER = {
  name: 'Aakash',
  email: 'aakash@example.com',
  phone: '+91 98765 43210',
  address: 'Dehradun, Uttarakhand, India',
};

export const Profile: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'orders' | 'wishlist' | 'wallet' | 'giftcards'>('details');

  const tabVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      
      {/* HEADER */}
      <div className="mb-12">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900 uppercase">
          My <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f42c37] to-red-500">Space.</span>
        </h1>
        <p className="text-xl text-gray-500 font-medium mt-2">Manage your SmartShop AI experience.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* SIDEBAR NAVIGATION */}
        <div className="w-full md:w-1/4">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col space-y-2 sticky top-32">
            {[
              { id: 'details', label: 'Personal Details', icon: '👤' },
              { id: 'orders', label: 'My Orders', icon: '📦' },
              { id: 'wishlist', label: 'My Wishlist', icon: '❤️' },
              { id: 'wallet', label: 'My Wallet', icon: '💳' },
              { id: 'giftcards', label: 'Gift Cards', icon: '🎁' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20' 
                    : 'bg-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="w-full md:w-3/4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={tabVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100 min-h-[500px]"
            >
              
              {/* --- PERSONAL DETAILS TAB --- */}
              {activeTab === 'details' && (
                <div>
                  <h2 className="text-3xl font-black mb-8 text-gray-900">Account Details</h2>
                  <form className="space-y-6 max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">Full Name</label>
                        <input type="text" defaultValue={MOCK_USER.name} className="w-full bg-gray-50 border border-gray-200 px-5 py-4 rounded-2xl font-medium outline-none focus:border-gray-900 transition-colors" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">Phone Number</label>
                        <input type="text" defaultValue={MOCK_USER.phone} className="w-full bg-gray-50 border border-gray-200 px-5 py-4 rounded-2xl font-medium outline-none focus:border-gray-900 transition-colors" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">Email Address</label>
                      <input type="email" defaultValue={MOCK_USER.email} readOnly className="w-full bg-gray-100 border border-gray-200 px-5 py-4 rounded-2xl font-medium text-gray-500 cursor-not-allowed" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">Delivery Address</label>
                      <textarea rows={3} defaultValue={MOCK_USER.address} className="w-full bg-gray-50 border border-gray-200 px-5 py-4 rounded-2xl font-medium outline-none focus:border-gray-900 transition-colors resize-none" />
                    </div>
                    <button type="button" className="bg-[#f42c37] text-white px-8 py-4 rounded-full font-bold hover:bg-red-600 active:scale-95 transition-all mt-4">
                      Save Changes
                    </button>
                  </form>
                </div>
              )}

              {/* --- WALLET TAB --- */}
              {activeTab === 'wallet' && (
                <div>
                  <h2 className="text-3xl font-black mb-8 text-gray-900">SmartShop Wallet</h2>
                  <div className="bg-gray-900 rounded-[2rem] p-10 text-white flex flex-col md:flex-row items-center justify-between mb-8 relative overflow-hidden">
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative z-10 text-center md:text-left mb-6 md:mb-0">
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Available Balance</p>
                      <h3 className="text-6xl font-black tracking-tighter">₹4,500<span className="text-2xl text-gray-500">.00</span></h3>
                    </div>
                    <div className="relative z-10 w-full md:w-auto">
                      <button className="w-full md:w-auto bg-[#f42c37] text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-gray-900 transition-colors">
                        + Add Money
                      </button>
                    </div>
                  </div>
                  
                  <h4 className="font-bold text-gray-900 text-lg mb-4">Recent Transactions</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">↓</div>
                        <div>
                          <p className="font-bold text-gray-900">Money Added</p>
                          <p className="text-xs text-gray-500 font-medium">Apr 28, 2026</p>
                        </div>
                      </div>
                      <p className="font-bold text-green-600">+ ₹2,000</p>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">↑</div>
                        <div>
                          <p className="font-bold text-gray-900">Purchased: Beats Solo</p>
                          <p className="text-xs text-gray-500 font-medium">Apr 20, 2026</p>
                        </div>
                      </div>
                      <p className="font-bold text-gray-900">- ₹12,499</p>
                    </div>
                  </div>
                </div>
              )}

              {/* --- GIFT CARDS TAB --- */}
              {activeTab === 'giftcards' && (
                <div>
                  <h2 className="text-3xl font-black mb-8 text-gray-900">Gift Cards</h2>
                  
                  {/* Add New Gift Card Section */}
                  <div className="bg-[#f42c37] rounded-[2rem] p-8 md:p-10 mb-10 flex flex-col md:flex-row items-center gap-6 shadow-lg shadow-red-500/20">
                    <div className="text-white md:w-1/2">
                      <h3 className="text-2xl font-black mb-2">Redeem a Card</h3>
                      <p className="text-red-100 font-medium text-sm">Enter your 16-digit code to add funds to your wallet instantly.</p>
                    </div>
                    <div className="md:w-1/2 w-full flex gap-2">
                      <input type="text" placeholder="XXXX-XXXX-XXXX-XXXX" className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 px-5 py-4 rounded-2xl font-mono font-bold outline-none focus:bg-white/20 transition-colors" />
                      <button className="bg-white text-[#f42c37] px-6 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-colors">Apply</button>
                    </div>
                  </div>

                  {/* Active Cards */}
                  <h4 className="font-bold text-gray-900 text-lg mb-4">My Active Cards</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-gray-900 text-white p-6 rounded-3xl relative overflow-hidden h-48 flex flex-col justify-between">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
                      <div className="relative z-10 flex justify-between items-start">
                        <span className="font-black tracking-widest opacity-50">SMARTSHOP AI</span>
                        <span className="font-bold bg-white/20 px-3 py-1 rounded-full text-xs">Active</span>
                      </div>
                      <div className="relative z-10">
                        <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-widest">Card Balance</p>
                        <p className="text-4xl font-black">₹1,000</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* --- ORDERS & WISHLIST PLACEHOLDERS --- */}
              {(activeTab === 'orders' || activeTab === 'wishlist') && (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50 py-20">
                  <div className="text-6xl mb-4">{activeTab === 'orders' ? '📦' : '❤️'}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {activeTab === 'orders' ? 'No orders yet' : 'Your wishlist is empty'}
                  </h3>
                  <p className="font-medium">
                    {activeTab === 'orders' ? 'Start shopping to see your history here.' : 'Save items you love to your wishlist.'}
                  </p>
                  <button onClick={() => onNavigate('shop')} className="mt-6 font-bold text-[#f42c37] hover:underline">
                    Explore Shop →
                  </button>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};