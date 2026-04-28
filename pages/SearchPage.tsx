import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const SearchPage: React.FC<{ onNavigate: (page: string, query?: string) => void }> = ({ onNavigate }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onNavigate('shop', query);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-4xl">
        <h1 className="text-center text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">What are you looking for?</h1>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full text-5xl md:text-8xl font-black text-gray-900 bg-transparent border-b-4 border-gray-200 placeholder-gray-200 focus:border-[#f42c37] outline-none pb-4 transition-colors"
          />
        </form>
        
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <span className="text-gray-500 font-bold py-2">Trending:</span>
          {['Headphones', 'PS5', 'Smart Watch', 'Laptops'].map((term) => (
            <button 
              key={term} 
              onClick={() => onNavigate('shop', term)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-6 py-2 rounded-full transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};