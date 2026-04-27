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

  // ================= FALLBACK =================
  async getFallbackRecommendations(productId: string): Promise<Product[]> {
    try {
      const current = await this.getProduct(productId);

      if (!current) return [];

      // Same category fallback
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', current.category)
        .neq('id', productId)
        .limit(5);

      if (!error && data && data.length > 0) {
        console.log("⚡ Category fallback");
        return data as Product[];
      }

      // Random fallback
      const { data: randomData } = await supabase
        .from('products')
        .select('*')
        .limit(5);

      console.log("⚡ Random fallback");

      return (randomData || []) as Product[];

    } catch (err) {
      console.error("❌ Fallback error:", err);
      return [];
    }
  },

  // ================= ML RECOMMENDATIONS =================
  async getRecommendations(productId: string): Promise<Product[]> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(`${ML_API}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: String(productId) }),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!res.ok) {
        console.warn("⚠️ ML API failed → fallback");
        return this.getFallbackRecommendations(productId);
      }

      let ids: string[] = await res.json();

      console.log("🎯 ML IDs:", ids);

      if (!ids || ids.length === 0) {
        console.warn("⚠️ Empty ML → fallback");
        return this.getFallbackRecommendations(productId);
      }

      // Clean IDs
      ids = Array.from(new Set(ids.map(id => String(id))));

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .in('id', ids);

      if (error || !data || data.length === 0) {
        console.warn("⚠️ DB fetch failed → fallback");
        return this.getFallbackRecommendations(productId);
      }

      // Preserve ML order
      const orderedProducts = ids
        .map(id => data.find(p => String(p.id) === id))
        .filter(Boolean) as Product[];

      return orderedProducts;

    } catch (err) {
      console.error("❌ Recommendation error:", err);
      return this.getFallbackRecommendations(productId);
    }
  },

  // ================= AI EXPLAINER =================
  async getExplanation(productId: string): Promise<string[]> {
    try {
      const res = await fetch(`${ML_API}/explain`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          product_id: String(productId)
        })
      });

      if (!res.ok) {
        console.warn("⚠️ Explain API failed");
        return [];
      }

      const data = await res.json();

      console.log("🧠 Explanation:", data);

      return data.reasons || [];

    } catch (err) {
      console.error("❌ Explanation error:", err);
      return [];
    }
  }

};
