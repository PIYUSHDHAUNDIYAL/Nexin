from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import os
import requests
from dotenv import load_dotenv

# ---------------- Setup ----------------

load_dotenv()

app = Flask(**name**)
CORS(app)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
raise RuntimeError("Supabase environment variables not set")

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

# ---------------- Load Products ----------------

def load_products():
url = f"{SUPABASE_URL}/rest/v1/products?select=id,name,brand,category,description,price,image"
res = requests.get(url, headers=HEADERS)

```
if res.status_code != 200:
    print("Supabase error:", res.text)
    return pd.DataFrame()

return pd.DataFrame(res.json())
```

# ---------------- Build Model ----------------

def rebuild_model():
global df, tfidf_matrix, cosine_sim, indices

```
df = load_products().head(100)

if df.empty:
    print("No data found")
    return

for col in ["name", "brand", "category", "description"]:
    df[col] = df[col].fillna("").astype(str)

df["soup"] = df["name"] + " " + df["brand"] + " " + df["category"] + " " + df["description"]

tfidf = TfidfVectorizer(stop_words="english")
tfidf_matrix = tfidf.fit_transform(df["soup"])
cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

indices = pd.Series(df.index, index=df["id"].astype(str)).drop_duplicates()
```

# ---------------- Init ----------------

rebuild_model()

# ---------------- TEXT RECOMMEND ----------------

@app.route("/recommend", methods=["POST"])
def recommend():
data = request.get_json()
product_id = str(data.get("product_id"))

```
if product_id not in indices:
    return jsonify([])

idx = indices[product_id]
scores = list(enumerate(cosine_sim[idx]))
scores = sorted(scores, key=lambda x: x[1], reverse=True)

result = [str(df.iloc[i[0]]["id"]) for i in scores[1:6]]
return jsonify(result)
```

# ---------------- IMAGE RECOMMEND (SAFE VERSION) ----------------

@app.route("/image-recommend", methods=["POST"])
def image_recommend():
try:
# basic fallback (no ML)
ids = [str(p["id"]) for p in df.head(5).to_dict("records")]
return jsonify(ids)
except Exception as e:
print("Error:", e)
return jsonify({"error": "failed"}), 500

# ---------------- HEALTH ----------------

@app.route("/")
def root():
return jsonify({"status": "running"})

@app.route("/health")
def health():
return jsonify({
"products": len(df)
})

# ---------------- Run ----------------

if **name** == "**main**":
port = int(os.environ.get("PORT", 5000))
app.run(host="0.0.0.0", port=port)
