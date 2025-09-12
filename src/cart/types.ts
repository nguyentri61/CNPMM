export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  meta?: Record<string, unknown>;
};

export type CartState = { items: CartItem[] };
