import React from 'react';
import { motion } from 'framer-motion';

export const Blog: React.FC = () => {
  const posts = [
    { title: "The Future of AI in E-Commerce", category: "Tech Trends", color: "bg-[#fdc62e]" },
    { title: "Top 5 Wireless Headphones of 2026", category: "Reviews", color: "bg-[#2dcc70]" },
    { title: "How to Build a Smart Home on a Budget", category: "Guides", color: "bg-[#1376f4]" },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900 mb-12">LATEST <span className="text-gray-400">NEWS</span></h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`${post.color} rounded-3xl p-8 min-h-[350px] flex flex-col justify-between text-white hover:-translate-y-2 transition-transform cursor-pointer`}
          >
            <span className="bg-white/20 px-4 py-1 rounded-full text-sm font-bold self-start backdrop-blur-sm">
              {post.category}
            </span>
            <div>
              <h2 className="text-3xl font-black leading-tight mb-4">{post.title}</h2>
              <p className="font-medium text-white/80 text-sm">Read Article →</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};