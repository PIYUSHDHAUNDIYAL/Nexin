import random

# ---------------- AI EXPLAINER ---------------- #
@app.route("/explain", methods=["POST"])
def explain():
    ensure_model()

    data = request.get_json()

    if not data or "product_id" not in data:
        return jsonify({"reasons": ["Popular product among users"]})

    product_id = str(data.get("product_id"))

    if product_id not in df["id"].values:
        return jsonify({"reasons": ["Trending product in this category"]})

    product = df[df["id"] == product_id].iloc[0]

    reasons = []

    # 🔥 Dynamic templates (AI-like)
    category_templates = [
        f"This {product['category']} is currently trending",
        f"Popular choice in the {product['category']} segment",
        f"Highly preferred in {product['category']} products"
    ]

    brand_templates = [
        f"{product['brand']} is known for strong performance and reliability",
        f"Trusted brand: {product['brand']} with consistent quality",
        f"{product['brand']} offers durable and feature-rich products"
    ]

    price_templates = [
        "Offers great value for money",
        "Competitively priced for its features",
        "Balanced pricing with solid performance"
    ]

    smart_templates = [
        "Matches user interest based on similar browsing patterns",
        "Frequently selected alongside similar products",
        "Recommended based on current shopping trends"
    ]

    # 🔥 Build explanation dynamically
    if product["category"]:
        reasons.append(random.choice(category_templates))

    if product["brand"]:
        reasons.append(random.choice(brand_templates))

    if product["price"]:
        reasons.append(random.choice(price_templates))

    reasons.append(random.choice(smart_templates))

    return jsonify({"reasons": reasons})
