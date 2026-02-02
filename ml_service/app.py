from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import os
import requests
from dotenv import load_dotenv

# ---------------- Setup ---------------- #
load_dotenv()

app = Flask(__name__)
CORS(app)

TOP_N = 5
PRICE_RANGE = 0.30      # ±30%
BRAND_BOOST = 0.05      # brand affinity weight

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("❌ Supabase environment variables not set")

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

# ---------------- Load Data from Supabase ---------------- #
def load_products():
    url = f"{SUPABASE_URL}/rest/v1/products?select=id,name,brand,category,description,price"
    res = requests.get(url, headers=HEADERS, timeout=30)

    if res.status_code != 200:
        print("❌ Supabase fetch failed:", res.text)
        return pd.DataFrame()

    data = res.json()
    print(f"✅ Loaded {len(data)} products from Supabase")
    return pd.DataFrame(data)

df = load_products()

# ---------------- Prepare ML Model ---------------- #
if df.empty:
    print("❌ No data loaded. ML not initialized.")
else:
    # Normalize text fields
    for col in ['name', 'brand', 'category', 'description']:
        df[col] = df[col].fillna("").astype(str)

    # Normalize price
    df['price'] = pd.to_numeric(df['price'], errors='coerce').fillna(0)

    # Text soup
    df['soup'] = (
        df['name'] + " " +
        df['brand'] + " " +
        df['category'] + " " +
        df['description']
    )

    tfidf = TfidfVectorizer(
        stop_words="english",
        ngram_range=(1, 2),
        max_df=0.8,
        min_df=1
    )

    tfidf_matrix = tfidf.fit_transform(df['soup'])
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

    indices = pd.Series(df.index, index=df['id'].astype(str)).drop_duplicates()
    max_price = df['price'].max() if df['price'].max() > 0 else 1

# ---------------- Routes ---------------- #

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ML Service Running",
        "products_loaded": int(len(df))
    })

@app.route("/recommend", methods=["POST"])
def recommend():
    if df.empty:
        return jsonify([])

    payload = request.get_json(force=True)
    product_id = str(payload.get("product_id", ""))

    if product_id not in indices:
        return jsonify([])

    idx = indices[product_id]
    base = df.loc[idx]

    base_category = base["category"]
    base_brand = base["brand"]
    base_price = base["price"]

    # 🔹 Category-first filter
    candidate_indices = df[df["category"] == base_category].index.tolist()
    if len(candidate_indices) <= 1:
        candidate_indices = df.index.tolist()

    scores = []

    for i in candidate_indices:
        if i == idx:
            continue

        text_sim = cosine_sim[idx][i]

        # Price filter
        if base_price > 0 and abs(df.loc[i, "price"] - base_price) > PRICE_RANGE * base_price:
            continue

        price_sim = (
            1 - abs(df.loc[i, "price"] - base_price) / max_price
            if base_price > 0 else 0
        )

        brand_sim = BRAND_BOOST if df.loc[i, "brand"] == base_brand else 0

        final_score = (0.80 * text_sim) + (0.15 * price_sim) + brand_sim
        scores.append((i, final_score))

    scores.sort(key=lambda x: x[1], reverse=True)

    # Global fallback
    if len(scores) < TOP_N:
        fallback = [(i, cosine_sim[idx][i]) for i in df.index if i != idx]
        fallback.sort(key=lambda x: x[1], reverse=True)
        scores.extend(fallback)

    top_matches = scores[:TOP_N]
    recommended_ids = df.loc[[i[0] for i in top_matches], "id"].astype(str).tolist()

    return jsonify(recommended_ids)

# ---------------- Run (Render Compatible) ---------------- #
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"🚀 Supabase-powered ML Service running on port {port}")
    app.run(host="0.0.0.0", port=port)
