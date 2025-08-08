// utils/CartStorage.ts

import type { CartItem } from "./CartTYpes";

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

export const removeFromCart = (productId: number): void => {
  const cart = getCart().filter((item) => item.productId !== productId);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const clearCart = (): void => {
  localStorage.removeItem(CART_KEY);
};

export const updateQuantity = (productId: number, newQuantity: number): void => {
  const cart = getCart().map((item) => {
    if (item.productId === productId) {
      return { ...item, quantity: Math.max(1, newQuantity) };
    }
    return item;
  });
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};
