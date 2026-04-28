import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../services/supabase'; // Adjust path if needed

export const Login: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const [isLogin, setIsLogin] = useState(true);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  // Status State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (isLogin) {
        // LOGIN LOGIC
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        // Success! Redirect to home or shop
        onNavigate('home');
        
      } else {
        // SIGNUP LOGIC
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            }
          }
        });

        if (error) throw error;
        
        setSuccessMsg('Registration successful! You can now log in.');
        setIsLogin(true); // Switch to login view
        setPassword(''); // Clear password for safety
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="max-w-[1000px] w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]"
      >
        {/* Left Side - Bold Branding */}
        <div className="md:w-1/2 bg-[#f42c37] p-12 text-white flex flex-col justify-center relative overflow-hidden">
          <h1 className="absolute -left-10 top-10 text-[10rem] font-black text-white/10 pointer-events-none select-none leading-none">
            {isLogin ? 'BACK' : 'JOIN'}
          </h1>
          <div className="relative z-10">
            <h2 className="text-5xl font-black mb-6">{isLogin ? 'Welcome Back.' : 'Create Account.'}</h2>
            <p className="text-red-100 font-medium mb-10">
              {isLogin ? 'Log in to access your AI recommendations and seamless checkout.' : 'Sign up to get personalized tech recommendations and exclusive offers.'}
            </p>
            <button 
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
                setSuccessMsg(null);
              }} 
              className="px-8 py-3 rounded-full border-2 border-white text-white font-bold hover:bg-white hover:text-[#f42c37] transition-all"
            >
              {isLogin ? 'Create an Account' : 'I already have an account'}
            </button>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-1/2 p-12 flex flex-col justify-center bg-gray-50">
          <h3 className="text-3xl font-black text-gray-900 mb-8">{isLogin ? 'Log In' : 'Sign Up'}</h3>
          
          {/* Status Messages */}
          {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">{error}</div>}
          {successMsg && <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-xl text-sm font-bold border border-green-100">{successMsg}</div>}

          <form className="space-y-6" onSubmit={handleAuth}>
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#f42c37] outline-none transition-all" 
                  placeholder="John Doe" 
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#f42c37] outline-none transition-all" 
                placeholder="you@example.com" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#f42c37] outline-none transition-all" 
                placeholder="••••••••" 
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-[#f42c37] active:scale-95 transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Register')}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};