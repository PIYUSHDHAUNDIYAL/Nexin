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
        res = requests.post(HF_API_URL, headers=HF_HEADERS, json=payload, timeout=6)

        if res.status_code != 200:
            return 0

        result = res.json()

        if isinstance(result, list) and len(result) > 0:
            return result[0].get("score", 0)

        return 0

    except:
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

# ---------------- IMAGE SEARCH (FINAL FIXED) ---------------- #
@app.route("/image-search", methods=["POST"])
def image_search():
    ensure_model()

    file = request.files.get("image")
    if not file:
        return jsonify({"error": "No image"}), 400

    image_bytes = file.read()

    try:
        scores = []

        # 🔥 STEP 1: LIMIT + SHUFFLE (IMPORTANT FIX)
        sample_df = df.sample(min(40, len(df)))

        for _, row in sample_df.iterrows():
            pid = str(row["id"])

            text = f"{row['name']} {row['category']}"

            clip_score = get_clip_score(image_bytes, text)

            # 🔥 STEP 2: TEXT BOOST (VERY IMPORTANT)
            soup = f"{row['name']} {row['category']} {row['description']}".lower()

            keyword_score = 0

            if "phone" in soup or "mobile" in soup:
                keyword_score += 0.4
            if "charger" in soup:
                keyword_score += 0.2
            if "earphone" in soup or "headphone" in soup:
                keyword_score += 0.2

            final_score = 0.7 * clip_score + 0.3 * keyword_score

            scores.append((pid, final_score))

        # 🔥 STEP 3: SORT
        scores.sort(key=lambda x: x[1], reverse=True)

        # 🔥 STEP 4: REMOVE WEAK MATCHES
        scores = [x for x in scores if x[1] > 0.15]

        if not scores:
            return jsonify(df["id"].astype(str).sample(TOP_N).tolist())

        # 🔥 STEP 5: REMOVE DUPLICATES
        seen = set()
        unique_results = []

        for pid, score in scores:
            if pid not in seen:
                unique_results.append(pid)
                seen.add(pid)

            if len(unique_results) >= TOP_N * 2:
                break

        # 🔥 STEP 6: FINAL TOP N
        final = unique_results[:TOP_N]

        print("✅ FINAL RESULTS:", final)

        return jsonify(final)

    except Exception as e:
        print("❌ Error:", e)
        return jsonify(df["id"].astype(str).sample(TOP_N).tolist())

# ---------------- Reload ---------------- #
@app.route("/reload", methods=["POST"])
def reload():
    global model_ready
    model_ready = False
    return {"reloaded": True}

# ---------------- Run ---------------- #
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))  # 🔥 FIXED PORT FOR RENDER
    app.run(host="0.0.0.0", port=port)
