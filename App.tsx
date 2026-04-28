import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { CartDrawer } from './components/CartDrawer';
import { Login } from './pages/Login';
import { supabaseClient } from './services/supabaseClient';

import { Product, CartItem } from './types';

// ✅ Added login
type Page = 'home' | 'shop' | 'product' | 'login';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [currentProductId, setCurrentProductId] = useState<string | undefined>();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [shopSearch, setShopSearch] = useState('');

  // ✅ REAL AUTH STATE
  const [session, setSession] = useState<any>(null);

  // ================= AUTH LISTENER =================
  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) {
        setCurrentPage('home');
      }
    });

    // Listen for changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);

        if (session) {
          setCurrentPage('home');
        } else {
          setCurrentPage('login');
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // ================= Navigation =================
  const navigate = (page: string, value?: string) => {
    // 🔒 Prevent access if not logged in
    if (!session && page !== 'login') {
      setCurrentPage('login');
      return;
    }

    if (page === 'login') {
      setCurrentPage('login');
    } 
    else if (page === 'product' && value) {
      setCurrentProductId(value);
      setCurrentPage('product');
    } 
    else if (page === 'shop') {
      setShopSearch(value || '');
      setCurrentProductId(undefined);
      setCurrentPage('shop');
    } 
    else {
      setCurrentProductId(undefined);
      setCurrentPage('home');
    }

    window.scrollTo(0, 0);
  };

  // ================= Quantity =================
  const increaseQty = (id: string) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQty = (id: string) => {
    setCart(prev =>
      prev
        .map(item =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  // ================= Cart =================
  const addToCart = (product: Product) => {
    if (!session) {
      setCurrentPage('login'); // 🔒 block cart if not logged in
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);

      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  // ================= Logout =================
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ✅ Navbar only if logged in */}
      {session && (
        <Navbar
          cart={cart}
          onToggleCart={() => setIsCartOpen(true)}
          onNavigate={navigate}
          onLogout={handleLogout}
          isLoggedIn={!!session}
        />
      )}

      <main>

        {/* LOGIN */}
        {currentPage === 'login' && (
          <Login onNavigate={navigate} />
        )}

        {/* PROTECTED PAGES */}
        {session && currentPage === 'home' && (
          <Home onNavigate={navigate} />
        )}

        {session && currentPage === 'shop' && (
          <Shop
            onNavigate={navigate}
            onAddToCart={addToCart}
            searchQuery={shopSearch}
          />
        )}

        {session && currentPage === 'product' && currentProductId && (
          <ProductDetails
            productId={currentProductId}
            onAddToCart={addToCart}
            onNavigate={navigate}
          />
        )}

      </main>

      {/* CART only if logged in */}
      {session && (
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          onRemove={removeFromCart}
          onIncrease={increaseQty}
          onDecrease={decreaseQty}
          clearCart={clearCart}
        />
      )}

    </div>
  );
}

export default App;
