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
      className="relative bg-white rounded-xl border hover:shadow-lg transition cursor-pointer flex flex-col"
    >
      {/* ❤️ Wishlist */}
      <button
        aria-label="Toggle wishlist"
        onClick={(e) => {
          e.stopPropagation();
          onToggleWishlist(product.id);
        }}
        className="absolute top-3 right-3 z-10 text-xl"
      >
        {isWishlisted ? '❤️' : '🤍'}
      </button>

      <img
        src={product.image}
        alt={product.name}
        className="h-64 w-full object-cover rounded-t-xl"
      />

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-gray-900">{product.name}</h3>

        <p className="text-sm text-gray-500 line-clamp-2 mt-1">
          {product.description}
        </p>

        <div className="mt-auto flex justify-between items-center pt-4">
          <span className="font-bold text-indigo-600">
            ₹{product.price.toLocaleString('en-IN')}
          </span>

          <button
            onClick={(e) => onAddToCart(product, e)}
            className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};
