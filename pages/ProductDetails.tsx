import React, { useEffect, useState } from 'react';
import { Product } from '../types';
import { api } from '../services/api';
import { ProductCard } from '../components/ProductCard';

interface ProductDetailsProps {
  productId: string; // ✅ must be dataset id like "amz_00001"
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
  const [loading, setLoading] = useState(true);
  const [recLoading, setRecLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      setRecommendations([]);
      setRecentlyViewed([]);

      try {
        // 1️⃣ Fetch product using DATASET ID
        const prod = await api.getProduct(String(productId));
        if (!isMounted) return;

        console.log('🔍 ProductDetails ID sent to ML:', prod.id); // DEBUG

        setProduct(prod);

        // 2️⃣ Track view (store DATASET ID only)
        api.trackView(String(prod.id));

        // 3️⃣ Recommendations (send SAME dataset ID)
        setRecLoading(true);
        const recs = await api.getRecommendations(String(prod.id));
        if (!isMounted) return;
        setRecommendations(recs);

        // 4️⃣ Recently viewed
        const viewedIds = JSON.parse(
          localStorage.getItem('recentlyViewed') || '[]'
        ) as string[];

        const allProducts = await api.getProducts();

        const recent = allProducts.filter(
          p => viewedIds.includes(p.id) && p.id !== prod.id
        );

        setRecentlyViewed(recent);
      } catch (err) {
        console.error('Error loading product details:', err);
      } finally {
        if (isMounted) {
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
      isMounted = false;
    };
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-20">Product not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* ===== Back Navigation ===== */}
      <div className="mb-6">
        <button
          onClick={() => onNavigate('shop')}
          className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:underline"
        >
          ← Back to Shop
        </button>
      </div>

      {/* ===== Product Section ===== */}
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 items-start">
        <div className="rounded-2xl overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="mt-10 lg:mt-0">
          <span className="inline-block mb-3 px-3 py-1 text-sm bg-indigo-100 text-indigo-800 rounded-full">
            {product.category}
          </span>

          <h1 className="text-3xl font-bold text-gray-900">
            {product.name}
          </h1>

          <p className="mt-3 text-3xl font-semibold text-indigo-600">
            ₹{product.price.toLocaleString('en-IN')}
          </p>

          <p className="mt-6 text-gray-700">
            {product.description}
          </p>

          <button
            onClick={() => onAddToCart(product)}
            className="mt-8 w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* ===== Recommendations ===== */}
      <div className="mt-24 border-t border-gray-200 pt-12">
        <h2 className="text-2xl font-bold mb-2">Recommended for You</h2>
        <p className="text-sm text-gray-500 mb-6">
          Based on product similarity
        </p>

        {recLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600" />
          </div>
        ) : recommendations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map(rec => (
              <ProductCard
                key={rec.id}
                product={rec}
                isWishlisted={false}
                onToggleWishlist={() => {}}
                onClick={(id) => onNavigate('product', id)} // ✅ passes dataset id
                onAddToCart={(p, e) => {
                  e.stopPropagation();
                  onAddToCart(p);
                }}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center">
            No recommendations available.
          </p>
        )}
      </div>

      {/* ===== Recently Viewed ===== */}
      {recentlyViewed.length > 0 && (
        <div className="mt-20 border-t pt-16">
          <h2 className="text-2xl font-bold mb-6">Recently Viewed</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentlyViewed.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                isWishlisted={false}
                onToggleWishlist={() => {}}
                onClick={(id) => onNavigate('product', id)} // ✅ dataset id
                onAddToCart={(prod, e) => {
                  e.stopPropagation();
                  onAddToCart(prod);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
