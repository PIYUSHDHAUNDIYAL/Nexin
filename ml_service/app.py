from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from functools import lru_cache
import os
import requests
from dotenv import load_dotenv

from PIL import Image
import numpy as np
from io import BytesIO

# ---------------- Setup ---------------- #
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": [
    "https://nexin.vercel.app",
    "https://nexin-seven.vercel.app"
]}})

TOP_N = 5
PRICE_RANGE = 0.30
BRAND_BOOST = 0.05

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
ADMIN_RELOAD_TOKEN = os.getenv("ADMIN_RELOAD_TOKEN")

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

# ---------------- Globals ---------------- #
df = pd.DataFrame()
cosine_sim = None
indices = {}
max_price = 1
image_features = {}

# ---------------- Load Data ---------------- #
def load_products():
    url = f"{SUPABASE_URL}/rest/v1/products?select=id,name,brand,category,description,price,image"
    res = requests.get(url, headers=HEADERS, timeout=30)

    data = res.json()
    print(f"✅ Loaded {len(data)} products")
    return pd.DataFrame(data)

# ---------------- Image Feature ---------------- #
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
    scores = list(enumerate(cosine_sim[idx]))
    scores = sorted(scores, key=lambda x: x[1], reverse=True)[1:TOP_N+1]

    return df.loc[[i[0] for i in scores], "id"].astype(str).tolist()

# ---------------- Build Model ---------------- #
def rebuild_model():
    global df, cosine_sim, indices, image_features

    df = load_products()

    for col in ["name", "brand", "category", "description"]:
        df[col] = df[col].fillna("").astype(str)

    df["soup"] = df["name"] + " " + df["brand"] + " " + df["category"] + " " + df["description"]

    tfidf = TfidfVectorizer(stop_words="english")
    matrix = tfidf.fit_transform(df["soup"])
    cosine_sim = cosine_similarity(matrix, matrix)

    indices = pd.Series(df.index, index=df["id"].astype(str)).drop_duplicates()

    # -------- IMAGE FEATURES -------- #
    image_features = {}

    for _, row in df.iterrows():
        pid = str(row["id"])
        img_url = row.get("image")

        try:
            print("Fetching:", img_url)

            if img_url:
                res = requests.get(img_url, timeout=5)
                img = Image.open(BytesIO(res.content)).convert("RGB")
                image_features[pid] = simple_image_features(img)
            else:
                image_features[pid] = np.zeros(64*64*3)

        except Exception as e:
            print("❌ Failed:", e)
            image_features[pid] = np.zeros(64*64*3)

    print("🖼️ Image features ready")
    return True

rebuild_model()

# ---------------- Routes ---------------- #
@app.route("/")
def root():
    return {"status": "running"}

@app.route("/health")
def health():
    return {"status": "ok", "products": len(df)}

@app.route("/recommend", methods=["POST"])
def recommend():
    product_id = str(request.json.get("product_id", ""))
    return jsonify(cached_recommend(product_id))

# -------- FIXED IMAGE SEARCH -------- #
@app.route("/image-search", methods=["POST"])
def image_search():
    file = request.files.get("image")

    if not file:
        return jsonify({"error": "No image"}), 400

    try:
        img = Image.open(file).convert("RGB")
        query_feat = simple_image_features(img)

        scores = []

        for pid, feat in image_features.items():
            # skip broken images
            if np.linalg.norm(feat) == 0:
                continue

            sim = np.dot(query_feat, feat) / (
                np.linalg.norm(query_feat) * np.linalg.norm(feat) + 1e-8
            )
            scores.append((pid, sim))

        # 🔥 IMPORTANT FIX
        if len(scores) == 0:
            print("⚠️ No matches → fallback")
            return jsonify(df["id"].astype(str).head(TOP_N).tolist())

        scores.sort(key=lambda x: x[1], reverse=True)

        result = [pid for pid, _ in scores[:TOP_N]]

        print("✅ Results:", result)
        return jsonify(result)

    except Exception as e:
        print("❌ Error:", e)
        return jsonify(df["id"].astype(str).head(TOP_N).tolist())

@app.route("/reload", methods=["POST"])
def reload():
    return {"reloaded": rebuild_model()}

# ---------------- Run ---------------- #
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
