import { supabase } from './supabaseClient';
import { Product } from '../types';

export const api = {
  // 🔹 Get all products (Supabase)
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products') // ⚠️ must match table name exactly
      .select('*');

    console.log('Supabase data:', data);
    console.log('Supabase error:', error);

    if (error) {
      console.error('Supabase error:', error);
      return [];
    }

    return (data || []) as Product[];
  },

  // 🔹 Get single product by ID
  async getProduct(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return null;
    }

    return data as Product;
  },

  // 🔹 Track recently viewed (local only)
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

  // 🔹 ML recommendations
async getRecommendations(productId: string): Promise<Product[]> {
  const ML_API = import.meta.env.VITE_ML_API_URL;

  const res = await fetch(`${ML_API}/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_id: productId })
  });

  if (!res.ok) return [];

  const ids: string[] = await res.json();
  if (!ids.length) return [];

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .in('id', ids);

  if (error) {
    console.error('Supabase error:', error);
    return [];
  }

  return (data || []) as Product[];
}

};
