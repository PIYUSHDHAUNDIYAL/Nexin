export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface WishlistItem {
  id: string;
}

