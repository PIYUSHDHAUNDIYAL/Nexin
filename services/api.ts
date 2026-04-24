import { supabase } from './supabaseClient';
import { Product } from '../types';

const ML_API = import.meta.env.VITE_ML_API_URL;

export const api = {

  // ================= GET ALL PRODUCTS =================
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (error) {
      console.error('❌ Supabase error:', error);
      return [];
    }

    console.log('✅ Products loaded:', data?.length);

    return (data || []) as Product[];
  },

  // ================= GET SINGLE PRODUCT =================
  async getProduct(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('❌ Supabase error:', error);
      return null;
    }

    return data as Product;
  },

  // ================= TRACK VIEW =================
  trackView(productId: string) {
    const viewed = JSON.parse(
      localStorage.getItem('recentlyViewed') || '[]'
    ) as string[];

    if (!viewed.includes(productId)) {
      viewed.unshift(productId);

      localStorage.setItem(
        'recentlyViewed',
        JSON.stringify(viewed.slice(0, 10))
      );
    }
  },

  // ================= ML RECOMMENDATIONS =================
  async getRecommendations(productId: string): Promise<Product[]> {
    try {
      const controller = new AbortController();

      // 🔥 timeout fix (important)
      const timeout = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(`${ML_API}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId }),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!res.ok) {
        console.warn("⚠️ ML API failed");
        return [];
      }

      let ids: string[] = await res.json();

      console.log("🎯 Recommendation IDs:", ids);

      if (!ids || !ids.length) return [];

      // 🔥 REMOVE DUPLICATES (VERY IMPORTANT)
      ids = Array.from(new Set(ids.map(id => String(id))));

      // 🔥 FETCH PRODUCTS
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .in('id', ids);

      if (error) {
        console.error('❌ Supabase error:', error);
        return [];
      }

      if (!data) return [];

      // 🔥 PRESERVE ORDER (CRITICAL FIX)
      const orderedProducts = ids
        .map(id => data.find(p => String(p.id) === id))
        .filter(Boolean) as Product[];

      return orderedProducts;

    } catch (err) {
      console.error("❌ Recommendation error:", err);
      return [];
    }
  }

};
