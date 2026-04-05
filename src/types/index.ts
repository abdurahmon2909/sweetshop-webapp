export interface Category {
  id: number;
  name: string;
  emoji: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface Product {
  id: number;
  category_id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  weight: string | null;
  badge: string | null;
  composition: string | null;
}

export interface CartItem {
  id: number;
  product_id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  price: number;
  qty: number;
  line_total: number;
  weight: string | null;
  badge: string | null;
}

export interface Cart {
  cart_id: number;
  telegram_id: number;
  items: CartItem[];
  total_qty: number;
  total_amount: number;
  currency: string;
}

export interface CheckoutRequest {
  telegram_id: number;
  customer_name: string;
  customer_phone: string;
  delivery_type: string | null;
  delivery_address: string | null;
  comment: string | null;
  payment_method: string;
}

export interface CheckoutResponse {
  order_id: number;
  public_order_id: string;
  payment_id: number;
  payload: string;
  total_amount: number;
  currency: string;
  status: string;
  items: CheckoutItem[];
}

export interface CheckoutItem {
  product_id: number;
  product_name: string;
  qty: number;
  price: number;
  line_total: number;
}