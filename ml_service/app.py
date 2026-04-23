from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from functools import lru_cache
import os
import requests
from dotenv import load_dotenv
import random

from PIL import Image
from io import BytesIO

# 🔥 CLIP
from sentence_transformers import SentenceTransformer
import numpy as np

# ---------------- Setup ---------------- #
load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)

TOP_N = 5

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

# 🔥 Load CLIP model (once)
print("🚀 Loading CLIP model...")
clip_model = SentenceTransformer('clip-ViT-B-32')
print("✅ CLIP loaded")

# ---------------- Globals ---------------- #
df = pd.DataFrame()
cosine_sim = None
indices = {}
image_embeddings = {}

# ---------------- Load Data ---------------- #
def load_products():
    url = f"{SUPABASE_URL}/rest/v1/products?select=id,name,brand,category,description,price,image&limit=100"
    
    res = requests.get(url, headers=HEADERS, timeout=10)

    if res.status_code != 200:
        print("❌ Supabase fetch failed:", res.text)
        return pd.DataFrame()

    data = res.json()
    print(f"✅ Loaded {len(data)} products")
    return pd.DataFrame(data)

# ---------------- CLIP Embedding ---------------- #
def get_image_embedding(img):
    return clip_model.encode(img)

# ---------------- Recommendation ---------------- #
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
    global df, cosine_sim, indices, image_embeddings

    df = load_products()
    if df.empty:
        return False

    for col in ["name", "brand", "category", "description"]:
        df[col] = df[col].fillna("").astype(str)

    df["soup"] = df["name"] + " " + df["brand"] + " " + df["category"] + " " + df["description"]

    tfidf = TfidfVectorizer(stop_words="english")
    matrix = tfidf.fit_transform(df["soup"])
    cosine_sim = cosine_similarity(matrix, matrix)

    indices = pd.Series(df.index, index=df["id"].astype(str)).drop_duplicates()

    # -------- IMAGE EMBEDDINGS -------- #
    image_embeddings = {}

    print("🖼️ Building CLIP embeddings...")

    for _, row in df.iterrows():
        pid = str(row["id"])
        img_url = row.get("image")

        try:
            if img_url:
                res = requests.get(img_url, timeout=3)

                if res.status_code == 200:
                    img = Image.open(BytesIO(res.content)).convert("RGB")
                    emb = get_image_embedding(img)
                    image_embeddings[pid] = emb
                else:
                    image_embeddings[pid] = None
            else:
                image_embeddings[pid] = None

        except Exception as e:
            print("❌ Image error:", e)
            image_embeddings[pid] = None

    print("✅ CLIP embeddings ready")
    return True

# Initial load
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

# -------- IMAGE SEARCH (CLIP POWERED) -------- #
@app.route("/image-search", methods=["POST"])
def image_search():
    file = request.files.get("image")

    if not file:
        return jsonify({"error": "No image"}), 400

    try:
        img = Image.open(file).convert("RGB")
        query_emb = get_image_embedding(img)

        scores = []

        # 🔥 sample for speed
        items = list(image_embeddings.items())
        items = random.sample(items, min(50, len(items)))

        for pid, emb in items:
            if emb is None:
                continue

            sim = cosine_similarity([query_emb], [emb])[0][0]
            scores.append((pid, sim))

        if len(scores) == 0:
            return jsonify(df["id"].astype(str).head(TOP_N).tolist())

        scores.sort(key=lambda x: x[1], reverse=True)

        result = [pid for pid, _ in scores[:TOP_N]]

        return jsonify(result)

    except Exception as e:
        print("❌ Error:", e)
        return jsonify(df["id"].astype(str).head(TOP_N).tolist())

@app.route("/reload", methods=["POST"])
def reload():
    return {"reloaded": rebuild_model()}

# ---------------- Run ---------------- #
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
