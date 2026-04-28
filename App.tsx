import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { supabase } from './services/supabase'; // Make sure this points to your Supabase client

// Components
import { Navbar } from './components/Navbar';
import { CartDrawer } from './components/CartDrawer';

// Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Success } from './pages/Success';
import { Login } from './pages/Login';
import { AboutUs } from './pages/AboutUs';
import { ContactUs } from './pages/ContactUs';
import { Blog } from './pages/Blog';
import { SearchPage } from './pages/SearchPage';
import { Profile } from './pages/Profile';

// Types
import { CartItem, Product } from './types';

// Define all valid page routes
type PageType = 
  | 'home' 
  | 'shop' 
  | 'product' 
  | 'cart' 
  | 'checkout' 
  | 'success' 
  | 'login' 
  | 'about' 
  | 'contact' 
  | 'blog' 
  | 'search' 
  | 'profile';

export const App: React.FC = () => {
  // Navigation State
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Cart State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Authentication Session State
  const [session, setSession] = useState<any>(null);

  // Listen for Logins and Logouts
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ================= Navigation =================
  const handleNavigate = (page: string, value?: string) => {
    const typedPage = page as PageType;

    if (typedPage === 'product' && value) {
      setSelectedProductId(value);
    } 
    else if ((typedPage === 'shop' || typedPage === 'search') && value) {
      setSearchQuery(value);
      setSelectedProductId(null);
    } 
    else if (typedPage === 'cart') {
      setIsCartOpen(false); // Close drawer if open
    }
    else if (typedPage === 'checkout') {
      setIsCartOpen(false); // Close drawer if open
    }
    else if (typedPage === 'success') {
      setCart([]); // Clear cart after order success
    }
    else {
      setSearchQuery('');
      setSelectedProductId(null);
    }

    setCurrentPage(typedPage);
    window.scrollTo(0, 0); // Scroll to top on navigation
  };

  // ================= Cart Logic =================
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true); // Open drawer so user sees it was added
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => handleUpdateQuantity(id, -999);
  const increaseQty = (id: string) => handleUpdateQuantity(id, 1);
  const decreaseQty = (id: string) => handleUpdateQuantity(id, -1);

  // ================= Animations =================
  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.3, ease: 'easeIn' } },
  };

  // ================= UI =================
  return (
    <div className="relative min-h-screen bg-[#f8f9fa] overflow-hidden">
      
      {/* Navbar - Sticky at the top */}
      <div className="sticky top-0 z-40 bg-white shadow-sm">
        <Navbar 
          cart={cart} 
          onToggleCart={() => setIsCartOpen(!isCartOpen)} 
          onNavigate={handleNavigate} 
          session={session}
        />
      </div>

      {/* Cart Drawer Overlay */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onRemove={removeFromCart}
        onIncrease={increaseQty}
        onDecrease={decreaseQty}
      />

      {/* Quick Checkout Button (Visible when Drawer is open) */}
      {isCartOpen && cart.length > 0 && (
        <div className="fixed bottom-5 right-5 z-50">
          <button
            onClick={() => handleNavigate('checkout')}
            className="bg-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-700 transition-colors"
          >
            Checkout →
          </button>
        </div>
      )}

      {/* Main Page Content */}
      <main className="relative z-10 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage + (selectedProductId || '')}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full"
          >
            {currentPage === 'home' && <Home onNavigate={handleNavigate} />}
            
            {currentPage === 'shop' && (
              <Shop onNavigate={handleNavigate} onAddToCart={handleAddToCart} searchQuery={searchQuery} />
            )}
            
            {currentPage === 'product' && selectedProductId && (
              <ProductDetails productId={selectedProductId} onNavigate={handleNavigate} onAddToCart={handleAddToCart} />
            )}
            
            {currentPage === 'cart' && <Cart cart={cart} onNavigate={handleNavigate} />}
            {currentPage === 'checkout' && <Checkout onNavigate={handleNavigate} />}
            {currentPage === 'success' && <Success />}
            
            {currentPage === 'login' && <Login onNavigate={handleNavigate} />}
            {currentPage === 'about' && <AboutUs />}
            {currentPage === 'contact' && <ContactUs />}
            {currentPage === 'blog' && <Blog />}
            {currentPage === 'search' && <SearchPage onNavigate={handleNavigate} />}
            {currentPage === 'profile' && <Profile onNavigate={handleNavigate} />}
            
          </motion.div>
        </AnimatePresence>
      </main>
      
    </div>
  );
};

export default App;
