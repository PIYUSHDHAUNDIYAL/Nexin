from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from functools import lru_cache
import os
import requests
from dotenv import load_dotenv

# NEW IMPORTS (lightweight)
from PIL import Image
import numpy as np
from io import BytesIO

# ---------------- Setup ---------------- #
load_dotenv()

app = Flask(__name__)
CORS(
    app,
    resources={
        r"/*": {
            "origins": [
                "https://nexin.vercel.app",
                "https://nexin-seven.vercel.app"
            ]
        }
    }
)

TOP_N = 5
PRICE_RANGE = 0.30
BRAND_BOOST = 0.05

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
ADMIN_RELOAD_TOKEN = os.getenv("ADMIN_RELOAD_TOKEN")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("❌ Supabase environment variables not set")

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

# ---------------- Globals ---------------- #
df = pd.DataFrame()
tfidf_matrix = None
cosine_sim = None
indices = {}
max_price = 1

# NEW: image features store
image_features = {}

# ---------------- Load Data ---------------- #
def load_products():
    # IMPORTANT: added image_url
    url = f"{SUPABASE_URL}/rest/v1/products?select=id,name,brand,category,description,price,image_url"
    res = requests.get(url, headers=HEADERS, timeout=30)

    if res.status_code != 200:
        print("❌ Supabase fetch failed:", res.text)
        return pd.DataFrame()

    data = res.json()
    print(f"✅ Loaded {len(data)} products from Supabase")
    return pd.DataFrame(data)

# ---------------- Simple Image Features ---------------- #
def simple_image_features(img):
    img = img.resize((64, 64))
    arr = np.array(img)
    return arr.flatten() / 255.0

# ---------------- Cached Recommendation ---------------- #
@lru_cache(maxsize=5000)
def cached_recommend(product_id: str):
    if product_id not in indices:
        return []

    idx = indices[product_id]
    base = df.loc[idx]

    base_category = base["category"]
    base_brand = base["brand"]
    base_price = base["price"]

    candidate_indices = df[df["category"] == base_category].index.tolist()
    if len(candidate_indices) <= 1:
        candidate_indices = df.index.tolist()

    scores = []

    for i in candidate_indices:
        if i == idx:
            continue

        text_sim = cosine_sim[idx][i]

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

    if len(scores) < TOP_N:
        fallback = [(i, cosine_sim[idx][i]) for i in df.index if i != idx]
        fallback.sort(key=lambda x: x[1], reverse=True)
        scores.extend(fallback)

    return df.loc[[i[0] for i in scores[:TOP_N]], "id"].astype(str).tolist()

# ---------------- Build / Rebuild Model ---------------- #
def rebuild_model():
    global df, tfidf_matrix, cosine_sim, indices, max_price, image_features

    df = load_products()
    if df.empty:
        print("❌ ML rebuild failed: no data")
        return False

    for col in ["name", "brand", "category", "description"]:
        df[col] = df[col].fillna("").astype(str)

    df["price"] = pd.to_numeric(df["price"], errors="coerce").fillna(0)

    df["soup"] = df["name"] + " " + df["brand"] + " " + df["category"] + " " + df["description"]

    tfidf = TfidfVectorizer(
        stop_words="english",
        ngram_range=(1, 2),
        max_df=0.8,
        min_df=1
    )

    tfidf_matrix = tfidf.fit_transform(df["soup"])
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

    indices = pd.Series(df.index, index=df["id"].astype(str)).drop_duplicates()
    max_price = df["price"].max() if df["price"].max() > 0 else 1

    # -------- NEW: IMAGE FEATURES -------- #
    image_features = {}

    for _, row in df.iterrows():
        pid = str(row["id"])
        img_url = row.get("image_url")

        try:
            if img_url:
                res = requests.get(img_url, timeout=5)
                img = Image.open(BytesIO(res.content)).convert("RGB")
                image_features[pid] = simple_image_features(img)
            else:
                image_features[pid] = np.zeros(64*64*3)
        except:
            image_features[pid] = np.zeros(64*64*3)

    print("🖼️ Image features ready")

    cached_recommend.cache_clear()
    print("♻️ ML model rebuilt & cache cleared")
    return True

# Initial load
rebuild_model()

# ---------------- Routes ---------------- #
@app.route("/", methods=["GET"])
def root():
    return jsonify({
        "service": "Nexin ML Recommendation API",
        "status": "running"
    })

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ML Service Running",
        "products_loaded": int(len(df))
    })

@app.route("/recommend", methods=["POST"])
def recommend():
    payload = request.get_json(force=True)
    product_id = str(payload.get("product_id", ""))
    return jsonify(cached_recommend(product_id))

# -------- NEW: IMAGE SEARCH -------- #
@app.route("/image-search", methods=["POST"])
def image_search():
    file = request.files.get("image")

    if not file:
        return jsonify({"error": "No image uploaded"}), 400

    try:
        img = Image.open(file).convert("RGB")
        query_feat = simple_image_features(img)

        scores = []

        for pid, feat in image_features.items():
            sim = np.dot(query_feat, feat) / (
                np.linalg.norm(query_feat) * np.linalg.norm(feat) + 1e-8
            )
            scores.append((pid, sim))

        scores.sort(key=lambda x: x[1], reverse=True)

        top_ids = [pid for pid, _ in scores[:TOP_N]]

        return jsonify(top_ids)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/reload", methods=["POST"])
def reload_model():
    token = request.headers.get("X-ADMIN-TOKEN")
    if token != ADMIN_RELOAD_TOKEN:
        return jsonify({"error": "Unauthorized"}), 401

    success = rebuild_model()
    return jsonify({"reloaded": success})

# ---------------- Run ---------------- #
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"🚀 Nexin ML Service running on port {port}")
    app.run(host="0.0.0.0", port=port)
