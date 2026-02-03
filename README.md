NEXIN – AI-Powered Smart E-Commerce Platform

A serverless, production-ready e-commerce platform with an AI-based recommendation system, built as a Major Project (Phase-2).

🚀 Project Overview

NEXIN is a modern smart shopping platform that uses machine learning to recommend products based on user behavior and product similarity.
The system is designed using a serverless architecture to ensure scalability, performance, and cost efficiency.

This project demonstrates full-stack development, ML integration, and cloud deployment best practices.

🧱 Tech Stack
Frontend

⚛️ React + Vite + TypeScript

🎨 Tailwind CSS

🌐 Deployed on Vercel

Backend / Database

🐘 Supabase (PostgreSQL)

REST API with Row Level Security (RLS)

Machine Learning Service

🐍 Python (Flask)

scikit-learn

TF-IDF Vectorization + Cosine Similarity

Deployed on Render

🧠 AI Recommendation System

The recommendation engine is content-based and works as follows:

Combines product name, brand, category, and description

Converts text into vectors using TF-IDF

Calculates similarity using Cosine Similarity

Applies:

Category-first filtering

Price range similarity

Brand affinity boost

Returns top-N recommended products

ML API Endpoints

GET / → Service status

GET /health → Health check

POST /recommend → Product recommendations

POST /reload → Rebuild ML model (secure)

✨ Features
🛒 E-Commerce

Product listing & product details

Add to cart & cart drawer

Wishlist (persistent using localStorage)

Recently viewed products

🤖 AI-Powered

Product-based recommendations

Explainable recommendations (brand, category, price similarity)

Cached inference for performance

🎨 UI/UX

Responsive design (mobile + desktop)

Skeleton loaders

Glassmorphism navbar

Animated cart drawer

Modern product cards

🧩 Architecture
Frontend (Vercel)
   |
   |-- Supabase REST API (Products, RLS enabled)
   |
   |-- ML Recommendation API (Render)
          |
          |-- TF-IDF Vectorizer
          |-- Cosine Similarity
          |-- In-Memory Caching

🔐 Security & Best Practices

Environment variables for all secrets

Supabase RLS enabled

ML service uses service role key (server-side only)

CORS restricted to frontend domain

No hardcoded credentials

📂 Project Structure
frontend/
│── components/
│   ├── Navbar.tsx
│   ├── ProductCard.tsx
│   ├── CartDrawer.tsx
│
│── pages/
│   ├── Home.tsx
│   ├── Shop.tsx
│   ├── ProductDetails.tsx
│
│── services/
│   ├── api.ts
│   ├── supabaseClient.ts
│
│── App.tsx
│── main.tsx
│── vite.config.ts
│
ml_service/
│── app.py
│── requirements.txt

⚙️ How It Works (Flow)

Products are stored in Supabase

Frontend fetches products using Supabase REST API

When a product is viewed:

View is tracked

Product ID is sent to ML service

ML service returns recommended product IDs

Frontend displays recommendations with UI explainability
