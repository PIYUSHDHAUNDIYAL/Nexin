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
import { Login } from './pages/Login';
import { AboutUs } from './pages/AboutUs';
import { ContactUs } from './pages/ContactUs';
import { Blog } from './pages/Blog';
import { SearchPage } from './pages/SearchPage';
import { Profile } from './pages/Profile'; // 🔥 Imported the new Profile page

// Types
import { CartItem, Product } from './types';

// Define all valid page routes
type PageType = 'home' | 'shop' | 'product' | 'login' | 'about' | 'contact' | 'blog' | 'search' | 'profile';

export const App: React.FC = () => {
  // Navigation State
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Cart State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  // 🔥 Authentication Session State
  const [session, setSession] = useState<any>(null);

  // 🔥 Listen for Logins and Logouts
  useEffect(() => {
    // Check if user is already logged in when the app loads
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for any auth state changes (like clicking login or logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Navigation Handler
  const handleNavigate = (page: string, idOrQuery?: string) => {
    setCurrentPage(page as PageType);
    
    // Handle passing data to specific pages
    if (page === 'product' && idOrQuery) {
      setSelectedProductId(idOrQuery);
    } else if ((page === 'shop' || page === 'search') && idOrQuery) {
      setSearchQuery(idOrQuery);
    } else {
      setSearchQuery('');
    }
  };

  // Cart Handlers
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

  // Ultra-clean page transition variants for Behance style
  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.3, ease: 'easeIn' } },
  };

  return (
    <div className="relative min-h-screen bg-[#f8f9fa] overflow-hidden">
      
      {/* Navbar - Sticky at the top */}
      <div className="sticky top-0 z-40 bg-white shadow-sm">
        <Navbar 
          cart={cart} 
          onToggleCart={() => setIsCartOpen(!isCartOpen)} 
          onNavigate={handleNavigate} 
          session={session} // 🔥 Passed session to Navbar
        />
      </div>

      {/* Cart Drawer Overlay */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onRemove={(id) => handleUpdateQuantity(id, -999)}
        onIncrease={(id) => handleUpdateQuantity(id, 1)}
        onDecrease={(id) => handleUpdateQuantity(id, -1)}
      />

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
            {currentPage === 'shop' && <Shop onNavigate={handleNavigate} onAddToCart={handleAddToCart} searchQuery={searchQuery} />}
            {currentPage === 'product' && selectedProductId && <ProductDetails productId={selectedProductId} onNavigate={handleNavigate} onAddToCart={handleAddToCart} />}
            {currentPage === 'login' && <Login onNavigate={handleNavigate} />}
            {currentPage === 'about' && <AboutUs />}
            {currentPage === 'contact' && <ContactUs />}
            {currentPage === 'blog' && <Blog />}
            {currentPage === 'search' && <SearchPage onNavigate={handleNavigate} />}
            {currentPage === 'profile' && <Profile onNavigate={handleNavigate} />} {/* 🔥 Added Profile Route */}
          </motion.div>
        </AnimatePresence>
      </main>
      
    </div>
  );
};

export default App;
