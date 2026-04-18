from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from functools import lru_cache
import os
import requests
from dotenv import load_dotenv

# ---------------- Setup ----------------

load_dotenv()

app = Flask(**name**)
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

# ---------------- Globals ----------------

df = pd.DataFrame()
tfidf_matrix = None
cosine_sim = None
indices = {}
max_price = 1

# ---------------- Load Data ----------------

def load_products():
url = f"{SUPABASE_URL}/rest/v1/products?select=id,name,brand,category,description,price"
res = requests.get(url, headers=HEADERS, timeout=30)

```
if res.status_code != 200:
    print("❌ Supabase fetch failed:", res.text)
    return pd.DataFrame()

data = res.json()
print(f"✅ Loaded {len(data)} products from Supabase")
return pd.DataFrame(data)
```

# ---------------- Cached Recommendation ----------------

@lru_cache(maxsize=5000)
def cached_recommend(product_id: str):
if product_id not in indices:
return []

```
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
```

# ---------------- Build / Rebuild Model ----------------

def rebuild_model():
global df, tfidf_matrix, cosine_sim, indices, max_price

```
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

cached_recommend.cache_clear()
print("♻️ ML model rebuilt & cache cleared")
return True
```

# Initial load

rebuild_model()

# ---------------- Routes ----------------

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

# ---------------- NEW TRACK ROUTE ----------------

@app.route("/track", methods=["POST"])
def track():
try:
data = request.get_json()

```
    user_id = data.get("user_id")
    product_id = data.get("product_id")
    action = data.get("action")

    print(f"📊 TRACK: user={user_id}, product={product_id}, action={action}")

    # Save to Supabase
    url = f"{SUPABASE_URL}/rest/v1/user_events"

    payload = {
        "user_id": user_id,
        "product_id": product_id,
        "action": action
    }

    res = requests.post(url, headers=HEADERS, json=payload)

    if res.status_code not in [200, 201]:
        print("❌ Supabase insert failed:", res.text)

    return jsonify({"message": "Tracked successfully"}), 200

except Exception as e:
    print("❌ Track error:", str(e))
    return jsonify({"error": "Tracking failed"}), 500
```

# ---------------- Reload Model ----------------

@app.route("/reload", methods=["POST"])
def reload_model():
token = request.headers.get("X-ADMIN-TOKEN")
if token != ADMIN_RELOAD_TOKEN:
return jsonify({"error": "Unauthorized"}), 401

```
success = rebuild_model()
return jsonify({"reloaded": success})
```

# ---------------- Run ----------------

if **name** == "**main**":
port = int(os.environ.get("PORT", 5000))
print(f"🚀 Nexin ML Service running on port {port}")
app.run(host="0.0.0.0", port=port)
