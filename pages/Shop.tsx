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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /* ================= Sync search ================= */
  useEffect(() => {
    setSearch(searchQuery);
  }, [searchQuery]);

  /* ================= Wishlist ================= */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('wishlist') || '[]');
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

    if (sortOrder === 'low') list.sort((a, b) => a.price - b.price);
    if (sortOrder === 'high') list.sort((a, b) => b.price - a.price);

    return list;
  }, [products, search, activeCategory, sortOrder]);

  /* ================= Skeleton ================= */
  const SkeletonCard = () => (
    <div className="animate-pulse bg-white rounded-2xl border p-4">
      <div className="h-40 bg-gray-200 rounded-lg mb-4" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
    </div>
  );

  /* ================= UI STATES ================= */
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
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Shop</h1>
        <p className="text-gray-500 mt-1">
          Discover products with AI-powered recommendations
        </p>
      </div>

      {/* ================= Controls ================= */}
      <div className="sticky top-20 z-30 mb-8 bg-white/80 backdrop-blur rounded-xl p-4 border flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg"
        />

        <select
          value={sortOrder}
          onChange={(e) =>
            setSortOrder(e.target.value as 'none' | 'low' | 'high')
          }
          className="px-4 py-2 border rounded-lg"
        >
          <option value="none">Sort by price</option>
          <option value="low">Low → High</option>
          <option value="high">High → Low</option>
        </select>
      </div>

      {/* ================= Categories ================= */}
      <div className="mb-10 flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`
              px-4 py-1.5 rounded-full text-sm font-medium
              transition
              ${
                activeCategory === category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            {category}
          </button>
        ))}
      </div>

      {/* ================= Wishlist ================= */}
      {wishlist.length > 0 && (
        <section className="mb-16">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            ❤️ Wishlist
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
        </section>
      )}

      {/* ================= Product Grid ================= */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          {activeCategory === 'All' ? 'All Products' : activeCategory}
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
      </section>
    </div>
  );
};
