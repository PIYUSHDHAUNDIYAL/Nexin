import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { CartDrawer } from './components/CartDrawer';
import { Login } from './components/Login'; // ✅ ADD THIS
import { supabase } from './services/supabase'; // ✅ ADD THIS

import { Product, CartItem } from './types';

// ✅ ADDED 'login'
type Page = 'home' | 'shop' | 'product' | 'login';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login'); // ✅ start from login
  const [currentProductId, setCurrentProductId] = useState<string | undefined>();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [shopSearch, setShopSearch] = useState('');

  // ================= Auto Login Check =================
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setCurrentPage('home');
      }
    });
  }, []);

  // ================= Navigation =================
  const navigate = (page: string, value?: string) => {
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
    setCurrentPage('login');
  };

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ✅ Hide Navbar on Login Page */}
      {currentPage !== 'login' && (
        <Navbar
          cart={cart}
          onToggleCart={() => setIsCartOpen(true)}
          onNavigate={navigate}
          onLogout={handleLogout} // ✅ pass logout
        />
      )}

      <main>

        {/* ✅ LOGIN PAGE */}
        {currentPage === 'login' && (
          <Login onNavigate={navigate} />
        )}

        {currentPage === 'home' && (
          <Home onNavigate={navigate} />
        )}

        {currentPage === 'shop' && (
          <Shop
            onNavigate={navigate}
            onAddToCart={addToCart}
            searchQuery={shopSearch}
          />
        )}

        {currentPage === 'product' && currentProductId && (
          <ProductDetails
            productId={currentProductId}
            onAddToCart={addToCart}
            onNavigate={navigate}
          />
        )}

      </main>

      {/* ✅ Hide cart on login */}
      {currentPage !== 'login' && (
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
