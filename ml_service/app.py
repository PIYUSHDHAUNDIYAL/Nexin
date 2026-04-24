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

        # ✅ SAFE PARSING
        if isinstance(result, list) and len(result) > 0:
            return result[0].get("score", 0)
        else:
            return 0

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

# ---------------- IMAGE SEARCH ---------------- #
@app.route("/image-search", methods=["POST"])
def image_search():
    file = request.files.get("image")

    if not file:
        return jsonify({"error": "No image"}), 400

    image_bytes = file.read()

    try:
        scores = []

        # 🔥 Bigger sample = better accuracy
        sample_df = df.sample(min(80, len(df)))

        for _, row in sample_df.iterrows():
            pid = str(row["id"])

            # 🔥 Strong prompt (VERY IMPORTANT)
            text = f"""
            Product: {row['name']}
            Category: {row['category']}
            Description: {row['description']}
            Type: electronic product
            """

            clip_score = get_clip_score(image_bytes, text)

            # 🔥 Keyword boost (improves precision)
            text_all = f"{row['name']} {row['category']} {row['description']}".lower()
            keyword_score = 0

            if any(word in text_all for word in ["phone", "mobile", "smartphone"]):
                keyword_score += 0.2

            if any(word in text_all for word in ["headphone", "earbud", "earphone"]):
                keyword_score += 0.2

            if any(word in text_all for word in ["charger", "cable", "usb"]):
                keyword_score += 0.2

            # 🔥 Final score
            final_score = 0.8 * clip_score + 0.2 * keyword_score

            scores.append((pid, final_score))

        # 🔥 Sort
        scores.sort(key=lambda x: x[1], reverse=True)

        # 🔥 Remove weak matches
        filtered = [x for x in scores if x[1] > 0.15]

        if not filtered:
            return jsonify(df["id"].astype(str).head(TOP_N).tolist())

        result = [pid for pid, _ in filtered[:TOP_N]]

        print("✅ FINAL RESULTS:", result)

        return jsonify(result)

    except Exception as e:
        print("❌ Error:", e)
        return jsonify(df["id"].astype(str).head(TOP_N).tolist())

# ---------------- Run ---------------- #
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
