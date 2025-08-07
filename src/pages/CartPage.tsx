import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import PuffLoader from "react-spinners/PuffLoader";

import Navbar from "../components/Navbar";
import { clearCart, getCart, removeFromCart } from "../utils/CartStorage";

import type { RootState } from "../App/store";
import type { CartItem } from "../utils/CartTYpes";

import {
  useCreateOrderItemMutation,
} from "../Features/Apis/OrderItemApis";

import {
  useCreateOrderMutation,
  useDeleteOrderMutation,
} from "../Features/Apis/ordersApi";

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  const userId = useSelector((state: RootState) => state.auth.user?.userId);
  const [createOrder] = useCreateOrderMutation();
  const [createOrderItem] = useCreateOrderItemMutation();
  const [deleteOrder] = useDeleteOrderMutation();

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

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const handleCreateOrder = async () => {
    if (!userId || cartItems.length === 0) return;
    setIsCreating(true);

    try {
      const order = await createOrder({
        userId,
        totalAmount: total,
      }).unwrap();

      if (!order || !order.orderId) {
        throw new Error("Missing order ID from response");
      }

      const newOrderId = order.orderId;
      setOrderId(newOrderId);

      for (const item of cartItems) {
        const payload = {
          orderId: newOrderId,
          productId: item.productId,
          quantity: item.quantity,
          price: Number(item.price),
        };
        await createOrderItem(payload).unwrap();
      }

      toast.success("✅ Order placed successfully!");
      // Do NOT clear the cart
    } catch (error: any) {
      toast.error("❌ Failed to create order");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteOrder = async () => {
    if (!orderId) return;

    try {
      await deleteOrder(orderId).unwrap();
      toast.success("🗑️ Order deleted successfully");

      // Reset order state but NOT cart
      setOrderId(null);
    } catch (error: any) {
      toast.error("❌ Failed to delete order");
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto mt-24 p-6">
        <h1 className="text-3xl font-bold mb-6">🛒 Your Cart</h1>

        {isCreating ? (
          <div className="flex justify-center items-center py-10">
            <PuffLoader color="#2563eb" size={60} />
          </div>
        ) : cartItems.length === 0 ? (
          <p className="text-gray-600">
            Your cart is empty.{" "}
            <Link to="/" className="text-blue-500">
              Shop now
            </Link>
          </p>
        ) : (
          <>
            <ul className="divide-y divide-gray-300 mb-4">
              {cartItems.map((item) => (
                <li
                  key={item.productId}
                  className="flex items-center justify-between py-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 rounded"
                    />
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

            <div className="mt-6 flex gap-4 flex-wrap">
              <button
                onClick={handleClear}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Clear Cart
              </button>

              {orderId ? (
                <>
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  >
                    Checkout Now
                  </button>
                  <button
                    onClick={handleDeleteOrder}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                  >
                    Delete Order
                  </button>
                </>
              ) : (
                <button
                  onClick={handleCreateOrder}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  disabled={isCreating}
                >
                  {isCreating ? "Placing Order..." : "Create Order"}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
