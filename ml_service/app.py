# 🔥 ADD THESE IMPORTS AT TOP

import torch
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
import numpy as np

# ---------------- IMAGE MODEL ----------------

model = models.mobilenet_v2(pretrained=True).features
model.eval()

transform = transforms.Compose([
transforms.Resize((224, 224)),
transforms.ToTensor()
])

# ---------------- FEATURE EXTRACTION ----------------

def extract_features(image):
image = transform(image).unsqueeze(0)
with torch.no_grad():
features = model(image)
return features.numpy().flatten()

# ---------------- IMAGE STORAGE ----------------

image_features = {}

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
        print("❌ Image load failed:", e)

print(f"✅ Loaded {len(image_features)} image embeddings")
```

# ---------------- MODIFY LOAD PRODUCTS ----------------

def load_products():
url = f"{SUPABASE_URL}/rest/v1/products?select=id,name,brand,category,description,price,image"
res = requests.get(url, headers=HEADERS, timeout=30)

```
if res.status_code != 200:
    print("❌ Supabase fetch failed:", res.text)
    return pd.DataFrame()

data = res.json()
print(f"✅ Loaded {len(data)} products from Supabase")
return pd.DataFrame(data)
```

# ---------------- CALL AFTER MODEL BUILD ----------------

rebuild_model()
load_image_features()

# ---------------- NEW IMAGE RECOMMEND ROUTE ----------------

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
