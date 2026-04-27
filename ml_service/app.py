from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from functools import lru_cache
import os
import requests
from dotenv import load_dotenv

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

# ---------------- Globals ---------------- #
df = pd.DataFrame()
model_ready = False

# ---------------- Load FULL Data ---------------- #
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

    print("✅ Model ready")
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

# ---------------- Recommendation ---------------- #
@lru_cache(maxsize=5000)
def cached_recommend(product_id: str):

    if product_id not in df["id"].values:
        return fallback()

    current = df[df["id"] == product_id].iloc[0]

    # 🔥 Filter same category
    filtered = df[df["category"] == current["category"]]

    if len(filtered) < 5:
        filtered = df

    # 🔥 TF-IDF
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

    # 🔥 Brand boost
    boost = (filtered["brand"] == current["brand"]).astype(int) * 0.2
    final_scores = scores + boost

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

    return results

# ---------------- NEW: AI EXPLAINER ---------------- #
@app.route("/explain", methods=["POST"])
def explain():
    ensure_model()

    product_id = str(request.json.get("product_id", ""))

    if product_id not in df["id"].values:
        return jsonify({"reasons": ["Popular product"]})

    product = df[df["id"] == product_id].iloc[0]

    reasons = []

    # 🔥 Simple smart rules
    if product["category"]:
        reasons.append(f"Belongs to {product['category']} category")

    if product["brand"]:
        reasons.append(f"From trusted brand {product['brand']}")

    if product["price"]:
        reasons.append("Matches your budget range")

    reasons.append("Recommended based on similar products")

    return jsonify({"reasons": reasons})

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
