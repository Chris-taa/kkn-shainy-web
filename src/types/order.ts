export type OrderItem = {
  title: string;
  quantity: number;
  price: number;
  image?: string;
  design?: string;
  color?: string;
  size?: string;
  material?: string;
};

export type OrderStatus = "pending" | "verified" | "rejected";

export type Order = {
  id: string;
  order_id: string;
  nama: string;
  no_hp: string;
  payment_method: string;
  items: OrderItem[];
  total_price: number;
  proof_file_url: string | null;
  status: OrderStatus;
  created_at: string;
};