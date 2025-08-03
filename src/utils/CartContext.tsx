import { createContext, useContext, type ReactNode, useEffect, useState } from "react";

import { getCart as loadCart, addToCart as storageAdd } from "../utils/CartStorage";
import type { CartItem } from "./CartTYpes";

interface CartContextType {
  cart: CartItem[];
  totalCount: number;
  addToCart: (item: CartItem) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    setCart(loadCart());
  }, []);

  const addToCart = (item: CartItem) => {
    storageAdd(item);
    setCart(loadCart());
  };

  const totalCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, totalCount, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};
