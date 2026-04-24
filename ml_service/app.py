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
import base64

# ---------------- Setup ---------------- #
load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)

TOP_N = 5

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
HF_API_KEY = os.getenv("HF_API_KEY")

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

# 🔥 HuggingFace CLIP API
HF_API_URL = "https://api-inference.huggingface.co/models/openai/clip-vit-base-patch32"
HF_HEADERS = {
    "Authorization": f"Bearer {HF_API_KEY}"
}

# ---------------- Globals ---------------- #
df = pd.DataFrame()
cosine_sim = None
indices = {}

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

# ---------------- CLIP SCORE ---------------- #
def get_clip_score(image_bytes, text):
    payload = {
        "inputs": {
            "image": base64.b64encode(image_bytes).decode("utf-8"),
            "text": text
        }
    }

    try:
        response = requests.post(HF_API_URL, headers=HF_HEADERS, json=payload, timeout=10)

        if response.status_code != 200:
            print("HF Error:", response.text)
            return 0

        result = response.json()

        return result[0]["score"]

    except Exception as e:
        print("HF Exception:", e)
        return 0

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
    global df, cosine_sim, indices

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

    print("✅ Model ready")
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

# -------- IMAGE SEARCH (CLIP POWERED) -------- #
@app.route("/image-search", methods=["POST"])
def image_search():
    file = request.files.get("image")

    if not file:
        return jsonify({"error": "No image"}), 400

    image_bytes = file.read()

    scores = []

    # 🔥 SPEED OPTIMIZATION
    sample_df = df.sample(min(20, len(df)))

    for _, row in sample_df.iterrows():
        pid = str(row["id"])

        # 🔥 CLIP works best with text
        text = f"{row['name']} {row['category']}"

        score = get_clip_score(image_bytes, text)

        scores.append((pid, score))

    if not scores:
        return jsonify(df["id"].astype(str).head(TOP_N).tolist())

    scores.sort(key=lambda x: x[1], reverse=True)

    result = [pid for pid, _ in scores[:TOP_N]]

    return jsonify(result)

@app.route("/reload", methods=["POST"])
def reload():
    return {"reloaded": rebuild_model()}

# ---------------- Run ---------------- #
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
