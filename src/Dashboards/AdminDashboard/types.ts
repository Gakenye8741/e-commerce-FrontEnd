export interface User {
  _id: string;
  name: string;
  createdAt: string;
}
export interface Order {
  orderId: number;
  userId: number;
  totalAmount: string; 
  status: string;
  createdAt: string;
}

export interface OrderItem {
  itemId: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: string | number;
}

