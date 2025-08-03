export interface CartItem {
  productId: number;
  title: string;
  price: number; // must always be number
  quantity: number;
  image: string;
}
