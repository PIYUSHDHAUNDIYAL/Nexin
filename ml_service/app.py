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
model_ready = False

# ---------------- Load FULL Data (Pagination Fix) ---------------- #
def load_products():
    all_data = []
    start = 0
    batch = 200

    while True:
        url = f"{SUPABASE_URL}/rest/v1/products?select=id,name,brand,category,description,price,image&limit={batch}&offset={start}"
        res = requests.get(url, headers=HEADERS)

        if res.status_code != 200:
            print("❌ Supabase error:", res.text)
            break

        data = res.json()

        if not data:
            break

        all_data.extend(data)
        start += batch

    print(f"✅ Total products loaded: {len(all_data)}")
    return pd.DataFrame(all_data)

# ---------------- Build Model ---------------- #
def rebuild_model():
    global df

    df = load_products()

    if df.empty:
        print("❌ No data found")
        return False

    for col in ["name", "brand", "category", "description"]:
        df[col] = df[col].fillna("").astype(str)

    df["id"] = df["id"].astype(str)

    print("✅ Model ready with full dataset")
    return True

# ---------------- Lazy Load ---------------- #
def ensure_model():
    global model_ready
    if not model_ready:
        print("⚡ Loading model...")
        success = rebuild_model()
        model_ready = success

# ---------------- Fallback ---------------- #
def fallback():
    if df.empty:
        return []
    return df["id"].sample(min(TOP_N, len(df))).tolist()

# ---------------- Recommendation (OPTIMIZED) ---------------- #
@lru_cache(maxsize=5000)
def cached_recommend(product_id: str):

    if product_id not in df["id"].values:
        print("❌ Product not found")
        return fallback()

    current = df[df["id"] == product_id].iloc[0]

    # 🔥 STEP 1: FILTER SAME CATEGORY
    filtered = df[df["category"] == current["category"]]

    if len(filtered) < 5:
        filtered = df

    # 🔥 STEP 2: TF-IDF ON FILTERED ONLY
    tfidf = TfidfVectorizer(stop_words="english")

    texts = (
        filtered["name"] + " " +
        filtered["brand"] + " " +
        filtered["description"]
    )

    matrix = tfidf.fit_transform(texts)

    current_text = f"{current['name']} {current['brand']} {current['description']}"
    current_vec = tfidf.transform([current_text])

    scores = cosine_similarity(current_vec, matrix).flatten()

    # 🔥 STEP 3: BRAND BOOST
    boost = (filtered["brand"] == current["brand"]).astype(int) * 0.2
    final_scores = scores + boost

    # 🔥 STEP 4: SORT
    top_indices = final_scores.argsort()[::-1]

    results = []
    for idx in top_indices:
        pid = str(filtered.iloc[idx]["id"])
        if pid != product_id:
            results.append(pid)
        if len(results) >= TOP_N:
            break

    if not results:
        return fallback()

    print("✅ Recommendations:", results)
    return results

# ---------------- IMAGE SEARCH (unchanged) ---------------- #
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

@app.route("/image-search", methods=["POST"])
def image_search():
    ensure_model()

    file = request.files.get("image")
    if not file:
        return jsonify({"error": "No image"}), 400

    image_bytes = file.read()

    try:
        scores = []

        sample_df = df.sample(min(50, len(df)))

        for _, row in sample_df.iterrows():
            pid = str(row["id"])
            text = f"{row['name']} {row['category']}"

            clip_score = get_clip_score(image_bytes, text)

            final_score = clip_score
            scores.append((pid, final_score))

        scores.sort(key=lambda x: x[1], reverse=True)

        final = [x[0] for x in scores[:TOP_N]]

        return jsonify(final)

    except Exception as e:
        print("❌ Error:", e)
        return jsonify(fallback())

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

    data = request.get_json()

    if not data or "product_id" not in data:
        return jsonify(fallback())

    product_id = str(data.get("product_id"))

    return jsonify(cached_recommend(product_id))

@app.route("/reload", methods=["POST"])
def reload():
    global model_ready
    model_ready = False
    return {"reloaded": True}

# ---------------- Run ---------------- #
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
