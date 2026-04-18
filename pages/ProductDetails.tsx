import React, { useEffect, useState } from 'react';
import { Product } from '../types';
import { api } from '../services/api';
import { ProductCard } from '../components/ProductCard';

interface ProductDetailsProps {
  productId: string;
  onAddToCart: (product: Product) => void;
  onNavigate: (page: string, id?: string) => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  productId,
  onAddToCart,
  onNavigate,
}) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [recLoading, setRecLoading] = useState(false);

  /* ================= Load Wishlist ================= */
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

  /* ================= Load Product + ML ================= */
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      setLoading(true);
      setRecommendations([]);
      setRecentlyViewed([]);

      try {
        // 1️⃣ Fetch product (dataset ID)
        const prod = await api.getProduct(String(productId));
        if (!mounted) return;

        setProduct(prod);

        // 2️⃣ Track view
        api.trackView(String(prod.id));

        // 3️⃣ Get recommendations
        setRecLoading(true);
        const recs = await api.getRecommendations(String(prod.id));
        if (mounted) setRecommendations(recs);

        // 4️⃣ Recently viewed
        const viewedIds = JSON.parse(
          localStorage.getItem('recentlyViewed') || '[]'
        ) as string[];

        const allProducts = await api.getProducts();

        const recent = allProducts.filter(
          p => viewedIds.includes(p.id) && p.id !== prod.id
        );

        if (mounted) setRecentlyViewed(recent);
      } catch (err) {
        console.error('Error loading product details:', err);
      } finally {
        if (mounted) {
          setLoading(false);
          setRecLoading(false);
        }
      }
    };

    if (productId) {
      loadData();
      window.scrollTo(0, 0);
    }

    return () => {
      mounted = false;
    };
  }, [productId]);

  /* ================= Skeleton ================= */
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="h-96 bg-gray-200 rounded-2xl" />
          <div>
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-6" />
            <div className="h-10 bg-gray-200 rounded w-1/2 mb-6" />
            <div className="h-24 bg-gray-200 rounded mb-6" />
            <div className="h-12 bg-gray-200 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-20">Product not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* ===== Back ===== */}
      <button
        onClick={() => onNavigate('shop')}
        className="mb-6 text-sm font-medium text-indigo-600 hover:underline"
      >
        ← Back to Shop
      </button>

      {/* ===== Product ===== */}
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="rounded-2xl overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <span className="inline-block mb-3 px-3 py-1 text-sm rounded-full bg-indigo-100 text-indigo-700">
            {product.category}
          </span>

          <h1 className="text-3xl font-bold text-gray-900">
            {product.name}
          </h1>

          <p className="mt-4 text-3xl font-bold text-indigo-600">
            ₹{product.price.toLocaleString('en-IN')}
          </p>

          <p className="mt-6 text-gray-700 leading-relaxed">
            {product.description}
          </p>

          <button
            onClick={() => onAddToCart(product)}
            className="
              mt-8 w-full py-3 rounded-xl
              bg-indigo-600 text-white font-medium
              hover:bg-indigo-700 active:scale-95
              transition
            "
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* ===== AI Recommendations ===== */}
      <section className="mt-24 border-t pt-12">
        <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
          🤖 AI Recommended for You
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Based on brand, category, and price similarity
        </p>

        {recLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-72 bg-gray-200 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : recommendations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {recommendations.map(rec => (
              <ProductCard
                key={rec.id}
                product={rec}
                isWishlisted={wishlist.includes(rec.id)}
                onToggleWishlist={toggleWishlist}
                onClick={(id) => onNavigate('product', id)}
                onAddToCart={(p, e) => {
                  e.stopPropagation();
                  onAddToCart(p);
                }}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No recommendations available.</p>
        )}
      </section>

      {/* ===== Recently Viewed ===== */}
      {recentlyViewed.length > 0 && (
        <section className="mt-20 border-t pt-12">
          <h2 className="text-2xl font-bold mb-6">
            Recently Viewed
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {recentlyViewed.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                isWishlisted={wishlist.includes(p.id)}
                onToggleWishlist={toggleWishlist}
                onClick={(id) => onNavigate('product', id)}
                onAddToCart={(prod, e) => {
                  e.stopPropagation();
                  onAddToCart(prod);
                }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
