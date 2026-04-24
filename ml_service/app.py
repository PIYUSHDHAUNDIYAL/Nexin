from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from functools import lru_cache
import os
import requests
from dotenv import load_dotenv
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

HF_API_URL = "https://api-inference.huggingface.co/models/openai/clip-vit-base-patch32"
HF_HEADERS = {
    "Authorization": f"Bearer {HF_API_KEY}"
}

# ---------------- Globals ---------------- #
df = pd.DataFrame()
cosine_sim = None
indices = {}
model_ready = False

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
        res = requests.post(HF_API_URL, headers=HF_HEADERS, json=payload, timeout=8)

        if res.status_code != 200:
            print("HF Error:", res.text)
            return 0

        result = res.json()

        if isinstance(result, list) and len(result) > 0:
            return result[0].get("score", 0)

        return 0

    except Exception as e:
        print("HF Exception:", e)
        return 0

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

# ---------------- Lazy Load ---------------- #
def ensure_model():
    global model_ready
    if not model_ready:
        print("⚡ Loading model...")
        rebuild_model()
        model_ready = True

# ---------------- Recommendation ---------------- #
@lru_cache(maxsize=5000)
def cached_recommend(product_id: str):
    if product_id not in indices:
        return []

    idx = indices[product_id]
    scores = list(enumerate(cosine_sim[idx]))
    scores = sorted(scores, key=lambda x: x[1], reverse=True)[1:TOP_N+1]

    return df.loc[[i[0] for i in scores], "id"].astype(str).tolist()

# ---------------- Routes ---------------- #
@app.route("/")
def root():
    return {"status": "running"}

@app.route("/health")
def health():
    return {"status": "ok", "products": len(df)}

@app.route("/recommend", methods=["POST"])
def recommend():
    ensure_model()
    product_id = str(request.json.get("product_id", ""))
    return jsonify(cached_recommend(product_id))

# ---------------- IMAGE SEARCH ---------------- #
@app.route("/image-search", methods=["POST"])
def image_search():
    ensure_model()

    file = request.files.get("image")
    if not file:
        return jsonify({"error": "No image"}), 400

    image_bytes = file.read()

    try:
        scores = []

        # 🔥 CATEGORY FILTER (VERY IMPORTANT)
        electronics_df = df[df["category"].str.lower().str.contains("electronic")]

        if electronics_df.empty:
            electronics_df = df

        # 🔥 LIMIT (FAST + BETTER)
        sample_df = electronics_df.head(50)

        for _, row in sample_df.iterrows():
            pid = str(row["id"])

            # 🔥 STRONG PROMPT
            text = f"This is a {row['category']} product called {row['name']}. {row['description']}"

            clip_score = get_clip_score(image_bytes, text)

            # 🔥 KEYWORD BOOST
            text_lower = text.lower()
            keyword_score = 0

            if "phone" in text_lower or "mobile" in text_lower:
                keyword_score += 0.3
            if "charger" in text_lower:
                keyword_score += 0.1
            if "earphone" in text_lower or "headphone" in text_lower:
                keyword_score += 0.1

            final_score = 0.7 * clip_score + 0.3 * keyword_score

            scores.append((pid, final_score))

        # 🔥 SORT
        scores.sort(key=lambda x: x[1], reverse=True)

        # 🔥 FILTER WEAK
        scores = [x for x in scores if x[1] > 0.2]

        if not scores:
            return jsonify(df["id"].astype(str).head(TOP_N).tolist())

        # 🔥 DIVERSITY FIX (NO REPEAT TYPE)
        seen = set()
        final = []

        for pid, score in scores:
            brand = df[df["id"] == pid]["brand"].values[0]

            if brand not in seen:
                final.append(pid)
                seen.add(brand)

            if len(final) == TOP_N:
                break

        print("✅ FINAL RESULTS:", final)

        return jsonify(final)

    except Exception as e:
        print("❌ Error:", e)
        return jsonify(df["id"].astype(str).head(TOP_N).tolist())
