import  { useEffect, useState } from "react";

import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { clearCart, getCart, removeFromCart, type CartItem } from "../utils/CartStorage";
import Navbar from "../components/Navbar";

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setCartItems(getCart());
  }, []);

  const handleRemove = (productId: number) => {
    removeFromCart(productId);
    setCartItems(getCart());
    toast.success("🗑️ Removed from cart");
  };

  const handleClear = () => {
    clearCart();
    setCartItems([]);
    toast("🧹 Cart cleared");
  };

  const total = cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  return (
    <>
     <Navbar />
     <div className="max-w-4xl mx-auto mt-24 p-6">
      <h1 className="text-3xl font-bold mb-6">🛒 Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty. <Link to="/" className="text-blue-500">Shop now</Link></p>
      ) : (
        <>
          <ul className="divide-y divide-gray-300 mb-4">
            {cartItems.map((item) => (
              <li key={item.productId} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <img src={item.image} alt={item.title} className="w-16 h-16 rounded" />
                  <div>
                    <h2 className="font-semibold">{item.title}</h2>
                    <p>Qty: {item.quantity}</p>
                    <p>Ksh {Number(item.price).toFixed(2)}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(item.productId)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="flex justify-between items-center font-semibold text-lg mt-4">
            <span>Total:</span>
            <span>Ksh {total.toFixed(2)}</span>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={handleClear}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Clear Cart
            </button>

            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              onClick={() => toast("🚧 Checkout not implemented yet.")}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
    </>
  );
}
