import React, { useState } from 'react';
import { CartItem } from '../types';

interface NavbarProps {
  cart: CartItem[];
  onToggleCart: () => void;
  onNavigate: (page: string, query?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cart,
  onToggleCart,
  onNavigate,
}) => {
  const [search, setSearch] = useState('');
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      onNavigate('shop', search.trim());
      setSearch('');
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center gap-4">

          {/* ===== LOGO ===== */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-sm">
              <span className="text-white font-extrabold text-lg">N</span>
            </div>
            <span className="text-2xl font-extrabold tracking-wide text-gray-900">
              NEXIN
            </span>
          </div>

          {/* ===== SEARCH (Desktop) ===== */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md mx-6"
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </form>

          {/* ===== ACTIONS ===== */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => onNavigate('home')}
              className="hidden sm:block text-sm font-medium text-gray-600 hover:text-indigo-600"
            >
              Home
            </button>

            <button
              onClick={() => onNavigate('shop')}
              className="hidden sm:block text-sm font-medium text-gray-600 hover:text-indigo-600"
            >
              Shop
            </button>

            {/* Cart */}
            <button
              onClick={onToggleCart}
              className="relative p-2 rounded-full text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>

              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 min-w-[20px] px-1 text-xs font-bold text-white bg-indigo-600 rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
