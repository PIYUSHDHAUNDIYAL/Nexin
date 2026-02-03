import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: (id: string) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}) => {
  return (
    <div
      onClick={() => onClick(product.id)}
      className="
        group relative flex flex-col
        bg-white rounded-2xl border border-gray-100
        shadow-sm hover:shadow-xl
        transition-all duration-300
        hover:-translate-y-1
        cursor-pointer
      "
    >
      {/* ❤️ Wishlist */}
      <button
        aria-label="Toggle wishlist"
        onClick={(e) => {
          e.stopPropagation();
          onToggleWishlist(product.id);
        }}
        className="
          absolute top-3 right-3 z-10
          h-9 w-9 rounded-full
          bg-white/90 backdrop-blur
          flex items-center justify-center
          shadow hover:scale-110 transition
        "
      >
        <span className={`text-lg ${isWishlisted ? 'text-red-500' : 'text-gray-400'}`}>
          ♥
        </span>
      </button>

      {/* 🖼 Image */}
      <div className="overflow-hidden rounded-t-2xl">
        <img
          src={product.image}
          alt={product.name}
          className="
            h-64 w-full object-cover
            transition-transform duration-300
            group-hover:scale-105
          "
        />
      </div>

      {/* 📦 Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Brand */}
        <p className="text-xs uppercase tracking-wide text-gray-400">
          {product.brand}
        </p>

        {/* Name */}
        <h3 className="mt-1 font-semibold text-gray-900 leading-snug line-clamp-2">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-500 line-clamp-2 mt-1">
          {product.description}
        </p>

        {/* Price + CTA */}
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-lg font-bold text-indigo-600">
            ₹{product.price.toLocaleString('en-IN')}
          </span>

          <button
            onClick={(e) => onAddToCart(product, e)}
            className="
              px-4 py-1.5 rounded-lg text-sm font-medium
              bg-indigo-600 text-white
              hover:bg-indigo-700
              active:scale-95
              transition
            "
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
