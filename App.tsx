import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { CartDrawer } from './components/CartDrawer';

// 🔥 NEW IMPORTS
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Success } from './pages/Success';

import { Product, CartItem } from './types';

// 🔥 ADD NEW PAGES
type Page = 'home' | 'shop' | 'product' | 'cart' | 'checkout' | 'success';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentProductId, setCurrentProductId] = useState<string | undefined>();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [shopSearch, setShopSearch] = useState('');

  // ================= Navigation =================
  const navigate = (page: string, value?: string) => {

    if (page === 'product' && value) {
      setCurrentProductId(value);
      setCurrentPage('product');
    } 
    else if (page === 'shop') {
      setShopSearch(value || '');
      setCurrentProductId(undefined);
      setCurrentPage('shop');
    } 
    else if (page === 'cart') {
      setIsCartOpen(false); // 🔥 close drawer if open
      setCurrentPage('cart');
    }
    else if (page === 'checkout') {
      setIsCartOpen(false);
      setCurrentPage('checkout');
    }
    else if (page === 'success') {
      setCart([]); // 🔥 clear cart after order
      setCurrentPage('success');
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

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ===== Navbar ===== */}
      <Navbar
        cart={cart}
        onToggleCart={() => setIsCartOpen(true)}
        onNavigate={navigate}
      />

      {/* ===== Pages ===== */}
      <main>

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

        {/* 🔥 NEW CART PAGE */}
        {currentPage === 'cart' && (
          <Cart cart={cart} onNavigate={navigate} />
        )}

        {/* 🔥 NEW CHECKOUT */}
        {currentPage === 'checkout' && (
          <Checkout onNavigate={navigate} />
        )}

        {/* 🔥 SUCCESS PAGE */}
        {currentPage === 'success' && (
          <Success />
        )}

      </main>

      {/* ===== Cart Drawer ===== */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onRemove={removeFromCart}
        onIncrease={increaseQty}
        onDecrease={decreaseQty}
      />

      {/* 🔥 QUICK CHECKOUT BUTTON (inside drawer idea) */}
      {isCartOpen && cart.length > 0 && (
        <div className="fixed bottom-5 right-5">
          <button
            onClick={() => navigate('checkout')}
            className="bg-green-600 text-white px-6 py-3 rounded-full shadow-lg"
          >
            Checkout →
          </button>
        </div>
      )}

    </div>
  );
}

export default App;
