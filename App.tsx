import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { CartDrawer } from './components/CartDrawer';
import { Product, CartItem } from './types';

type Page = 'home' | 'shop' | 'product';

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
  else {
    // home or fallback
    setCurrentProductId(undefined);
    setCurrentPage('home');
  }

  window.scrollTo(0, 0);
};


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


  // ================= Cart Logic =================
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

    </div>
  );
}

export default App;
