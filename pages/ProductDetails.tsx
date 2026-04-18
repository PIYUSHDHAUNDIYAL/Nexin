import React, { useEffect, useState } from 'react';
import { Product } from '../types';
import { api } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { supabase } from '../lib/supabase'; // ✅ ADDED

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

const [userId, setUserId] = useState<string | null>(null); // ✅ ADDED

/* ================= GET USER ================= */
useEffect(() => {
const getUser = async () => {
const { data } = await supabase.auth.getUser();
setUserId(data.user?.id || null);
};
getUser();
}, []);

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

```
  localStorage.setItem('wishlist', JSON.stringify(updated));
  return updated;
});
```

};

/* ================= Load Product + ML ================= */
useEffect(() => {
let mounted = true;

```
const loadData = async () => {
  setLoading(true);
  setRecommendations([]);
  setRecentlyViewed([]);

  try {
    // 1️⃣ Fetch product
    const prod = await api.getProduct(String(productId));
    if (!mounted) return;

    setProduct(prod);

    // 2️⃣ ✅ TRACK WITH USER (SAFE)
    if (userId) {
      await fetch("https://your-api-url/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id: userId,
          product_id: prod.id,
          action: "view"
        })
      });
    }

    // 3️⃣ Fallback tracking (keep existing)
    api.trackView(String(prod.id));

    // 4️⃣ Recommendations
    setRecLoading(true);
    const recs = await api.getRecommendations(String(prod.id));
    if (mounted) setRecommendations(recs);

    // 5️⃣ Recently viewed
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

if (productId && userId !== undefined) {
  loadData();
  window.scrollTo(0, 0);
}

return () => {
  mounted = false;
};
```

}, [productId, userId]); // ✅ UPDATED

/* ================= Skeleton ================= */
if (loading) {
return ( <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse"> <div className="grid lg:grid-cols-2 gap-12"> <div className="h-96 bg-gray-200 rounded-2xl" /> <div> <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" /> <div className="h-8 bg-gray-200 rounded w-3/4 mb-6" /> <div className="h-10 bg-gray-200 rounded w-1/2 mb-6" /> <div className="h-24 bg-gray-200 rounded mb-6" /> <div className="h-12 bg-gray-200 rounded w-full" /> </div> </div> </div>
);
}

if (!product) {
return <div className="text-center py-20">Product not found</div>;
}

return ( <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

```
  <button
    onClick={() => onNavigate('shop')}
    className="mb-6 text-sm font-medium text-indigo-600 hover:underline"
  >
    ← Back to Shop
  </button>

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
        className="mt-8 w-full py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 active:scale-95 transition"
      >
        Add to Cart
      </button>
    </div>
  </div>

  {/* AI Recommendations and Recently Viewed remain SAME */}
</div>
```

);
};
