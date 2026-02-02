import React from 'react';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

      {/* ================= Hero Section ================= */}
      <div className="text-center mb-20">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block xl:inline">Smart Shopping</span>{' '}
          <span className="block text-indigo-600 xl:inline">Redefined</span>
        </h1>

        <p className="mt-6 max-w-3xl mx-auto text-base text-gray-500 sm:text-lg">
          Discover products with AI-powered recommendations, personalized just
          for you.
        </p>

        {/* ===== Hero CTA ===== */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => onNavigate('shop')}
            className="px-8 py-4 bg-indigo-600 text-white rounded-md text-base font-medium hover:bg-indigo-700 transition"
          >
            Go to Shop
          </button>
        </div>
      </div>

      {/* ================= Trust Badges ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        <div className="p-8 bg-gray-50 rounded-xl">
          <h3 className="font-semibold text-gray-900 text-lg">🤖 AI Powered</h3>
          <p className="text-sm text-gray-500 mt-3">
            Smart recommendations using machine learning
          </p>
        </div>

        <div className="p-8 bg-gray-50 rounded-xl">
          <h3 className="font-semibold text-gray-900 text-lg">🔒 Secure</h3>
          <p className="text-sm text-gray-500 mt-3">
            Safe and reliable shopping experience
          </p>
        </div>

        <div className="p-8 bg-gray-50 rounded-xl">
          <h3 className="font-semibold text-gray-900 text-lg">⚡ Fast</h3>
          <p className="text-sm text-gray-500 mt-3">
            Optimized performance with instant feedback
          </p>
        </div>
      </div>
    </div>
  );
};
