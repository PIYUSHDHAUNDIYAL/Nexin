import React, { useEffect, useMemo, useState } from 'react';
import { Product } from '../types';
import { api } from '../services/api';
import { ProductCard } from '../components/ProductCard';

interface ShopProps {
  onNavigate: (page: string, id?: string) => void;
  onAddToCart: (product: Product) => void;
  searchQuery?: string;
}

export const Shop: React.FC<ShopProps> = ({
  onNavigate,
  onAddToCart,
  searchQuery = '',
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState(searchQuery);
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState<'none' | 'low' | 'high'>('none');
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /* ================= Sync search from Navbar ================= */
  useEffect(() => {
    setSearch(searchQuery);
  }, [searchQuery]);

  /* ================= Load wishlist ================= */
  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem('wishlist') || '[]'
    ) as string[];
    setWishlist(saved);
  }, []);

  const toggleWishlist = (id: string) => {
    setWishlist(prev => {
      const updated = prev.includes(id)
        ? prev.filter(pid => pid !== id)
        : [...prev, id];

      localStorage.setItem('wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  /* ================= Load products ================= */
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await api.getProducts();
        setProducts(data);

        const viewedIds = JSON.parse(
          localStorage.getItem('recentlyViewed') || '[]'
        ) as string[];

        setRecentlyViewed(data.filter(p => viewedIds.includes(p.id)));
      } catch {
        setError('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  /* ================= Categories ================= */
  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map(p => p.category)));
    return ['All', ...unique];
  }, [products]);

  /* ================= Filter + Sort ================= */
  const filteredProducts = useMemo(() => {
    let list = products.filter(p => {
      const matchCategory =
        activeCategory === 'All' || p.category === activeCategory;

      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase());

      return matchCategory && matchSearch;
    });

    if (sortOrder === 'low') {
      list = [...list].sort((a, b) => a.price - b.price);
    }
    if (sortOrder === 'high') {
      list = [...list].sort((a, b) => b.price - a.price);
    }

    return list;
  }, [products, search, activeCategory, sortOrder]);

  /* ================= UI STATES ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* ================= Header ================= */}
      <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shop</h1>
          <p className="text-sm text-gray-500 mt-1">
            Browse products with smart recommendations
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-md"
          />

          <select
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(e.target.value as 'none' | 'low' | 'high')
            }
            className="px-4 py-2 border rounded-md"
          >
            <option value="none">Sort by Price</option>
            <option value="low">Low → High</option>
            <option value="high">High → Low</option>
          </select>
        </div>
      </div>

      {/* ================= Category Tabs ================= */}
      <div className="mb-10 flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-sm ${
              activeCategory === category
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* ================= Wishlist ================= */}
      {wishlist.length > 0 && (
        <div className="mb-16">
          <h2 className="text-xl font-semibold mb-4">❤️ Wishlist</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products
              .filter(p => wishlist.includes(p.id))
              .map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted
                  onToggleWishlist={toggleWishlist}
                  onClick={(id) => onNavigate('product', id)}
                  onAddToCart={(p, e) => {
                    e.stopPropagation();
                    onAddToCart(p);
                  }}
                />
              ))}
          </div>
        </div>
      )}

      {/* ================= Product Grid ================= */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {activeCategory === 'All' ? 'All Products' : activeCategory}
        </h2>

        {filteredProducts.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlist.includes(product.id)}
                onToggleWishlist={toggleWishlist}
                onClick={(id) => onNavigate('product', id)}
                onAddToCart={(p, e) => {
                  e.stopPropagation();
                  onAddToCart(p);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
