from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from functools import lru_cache
import os
import requests
from dotenv import load_dotenv

# 🔥 IMAGE IMPORTS

import torch
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
import numpy as np

# ---------------- Setup ----------------

load_dotenv()

app = Flask(**name**)
CORS(app)

TOP_N = 5
PRICE_RANGE = 0.30
BRAND_BOOST = 0.05

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
raise RuntimeError("❌ Supabase environment variables not set")

HEADERS = {
"apikey": SUPABASE_KEY,
"Authorization": f"Bearer {SUPABASE_KEY}",
"Content-Type": "application/json"
}

# ---------------- IMAGE MODEL ----------------

model = models.mobilenet_v2(pretrained=True).features
model.eval()

transform = transforms.Compose([
transforms.Resize((224, 224)),
transforms.ToTensor()
])

def extract_features(image):
image = transform(image).unsqueeze(0)
with torch.no_grad():
features = model(image)
return features.numpy().flatten()

# ---------------- Globals ----------------

df = pd.DataFrame()
tfidf_matrix = None
cosine_sim = None
indices = {}
max_price = 1
image_features = {}

# ---------------- Load Data ----------------

def load_products():
url = f"{SUPABASE_URL}/rest/v1/products?select=id,name,brand,category,description,price,image"
res = requests.get(url, headers=HEADERS, timeout=30)

```
if res.status_code != 200:
    print("❌ Supabase fetch failed:", res.text)
    return pd.DataFrame()

data = res.json()
print(f"✅ Loaded {len(data)} products")
return pd.DataFrame(data)
```

# ---------------- Build Model ----------------

def rebuild_model():
global df, tfidf_matrix, cosine_sim, indices, max_price

```
df = load_products().head(150)  # 🔥 LIMIT for Render

if df.empty:
    print("❌ No data")
    return False

for col in ["name", "brand", "category", "description"]:
    df[col] = df[col].fillna("").astype(str)

df["price"] = pd.to_numeric(df["price"], errors="coerce").fillna(0)

df["soup"] = df["name"] + " " + df["brand"] + " " + df["category"] + " " + df["description"]

tfidf = TfidfVectorizer(stop_words="english")

tfidf_matrix = tfidf.fit_transform(df["soup"])
cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

indices = pd.Series(df.index, index=df["id"].astype(str)).drop_duplicates()
max_price = df["price"].max() if df["price"].max() > 0 else 1

print("♻️ Model ready")
return True
```

# ---------------- Load Image Features ----------------

def load_image_features():
global image_features

```
print("📸 Loading image features...")

for _, row in df.iterrows():
    img_url = row.get("image")

    if not img_url:
        continue

    try:
        response = requests.get(img_url, stream=True, timeout=10)
        img = Image.open(response.raw).convert("RGB")

        image_features[str(row["id"])] = extract_features(img)

    except Exception as e:
        print("❌ Image error:", e)

print(f"✅ Loaded {len(image_features)} images")
```

# ---------------- Init ----------------

rebuild_model()
load_image_features()

# ---------------- Text Recommendation ----------------

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

ids = [str(df.iloc[i[0]]["id"]) for i in scores[1:6]]
return jsonify(ids)
```

# ---------------- Image Recommendation ----------------

@app.route("/image-recommend", methods=["POST"])
def image_recommend():
try:
file = request.files["image"]
image = Image.open(file.stream).convert("RGB")

```
    query_features = extract_features(image)

    scores = []

    for pid, feat in image_features.items():
        sim = cosine_similarity([query_features], [feat])[0][0]
        scores.append((pid, sim))

    scores.sort(key=lambda x: x[1], reverse=True)

    top_ids = [pid for pid, _ in scores[:5]]

    return jsonify(top_ids)

except Exception as e:
    print("❌ Image recommend error:", str(e))
    return jsonify({"error": "Failed"}), 500
```

# ---------------- Health ----------------

@app.route("/")
def root():
return jsonify({"status": "running"})

@app.route("/health")
def health():
return jsonify({
"products": len(df),
"images": len(image_features)
})

# ---------------- Run ----------------

if **name** == "**main**":
port = int(os.environ.get("PORT", 5000))
app.run(host="0.0.0.0", port=port)
