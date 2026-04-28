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
    <nav className="sticky top-0 z-50 backdrop-blur bg-white/80 border-b border-gray-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* ===== LOGO ===== */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow">
              <span className="text-white font-extrabold text-lg">N</span>
            </div>
            <span className="text-xl font-extrabold tracking-wide text-gray-900">
              NEXIN
            </span>
          </div>

          {/* ===== SEARCH (Desktop) ===== */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md mx-6"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="
                  w-full pl-10 pr-4 py-2 rounded-xl
                  border border-gray-200
                  bg-white/90
                  focus:outline-none focus:ring-2 focus:ring-indigo-500
                "
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"
                />
              </svg>
            </div>
          </form>

          {/* ===== ACTIONS ===== */}
          <div className="flex items-center gap-5">
            <button
              onClick={() => onNavigate('home')}
              className="hidden sm:block text-sm font-medium text-gray-600 hover:text-indigo-600 transition"
            >
              Home
            </button>

            <button
              onClick={() => onNavigate('shop')}
              className="hidden sm:block text-sm font-medium text-gray-600 hover:text-indigo-600 transition"
            >
              Shop
            </button>

            {/* Cart */}
            <button
              onClick={onToggleCart}
              className="
                relative p-2 rounded-full
                text-gray-700
                hover:text-indigo-600 hover:bg-indigo-50
                transition
              "
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
                <span className="
                  absolute -top-1 -right-1
                  min-w-[20px] h-5 px-1
                  flex items-center justify-center
                  text-xs font-bold text-white
                  bg-indigo-600 rounded-full
                  shadow
                ">
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
