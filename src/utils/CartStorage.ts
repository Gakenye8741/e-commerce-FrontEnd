// src/utils/cartStorage.ts

export interface CartItem {
  productId: number;
  title: string;
  price: number | string;
  quantity: number;
  image: string;
}

const CART_KEY = "cart";

export const getCart = (): CartItem[] => {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
};

export const addToCart = (item: CartItem): void => {
  const cart = getCart();
  const index = cart.findIndex((i) => i.productId === item.productId);

  if (index !== -1) {
    cart[index].quantity += item.quantity;
  } else {
    cart.push(item);
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const clearCart = () => {
  localStorage.removeItem(CART_KEY);
};

export const removeFromCart = (productId: number) => {
  const cart = getCart().filter((item) => item.productId !== productId);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};
