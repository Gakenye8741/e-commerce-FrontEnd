// pages/CartPage.tsx

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import PuffLoader from "react-spinners/PuffLoader";
import Swal from "sweetalert2";

import Navbar from "../components/Navbar";

import {
  clearCart,
  getCart,
  removeFromCart,
  updateQuantity,
} from "../utils/CartStorage";

import type { RootState } from "../App/store";
import type { CartItem } from "../utils/CartTYpes";

import {
  useCreateOrderItemMutation,
} from "../Features/Apis/OrderItemApis";

import {
  useCreateOrderMutation,
  useDeleteOrderMutation,
} from "../Features/Apis/ordersApi";
import { useInitiateSTKPushMutation } from "../Features/Apis/MpesaApi";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  const userId = useSelector((state: RootState) => state.auth.user?.userId);
  const [createOrder] = useCreateOrderMutation();
  const [createOrderItem] = useCreateOrderItemMutation();
  const [deleteOrder] = useDeleteOrderMutation();
  const [initiateSTKPush] = useInitiateSTKPushMutation();

  useEffect(() => {
    setCartItems(getCart());
  }, []);

  const refreshCart = () => {
    setCartItems(getCart());
  };

  const handleRemove = (productId: number) => {
    removeFromCart(productId);
    refreshCart();
    toast.success("🗑️ Removed from cart");
  };

  const handleClear = () => {
    clearCart();
    refreshCart();
    toast("🧹 Cart cleared");
  };

  const handleQtyChange = (productId: number, delta: number) => {
    const item = cartItems.find((i) => i.productId === productId);
    if (!item) return;

    const newQty = item.quantity + delta;
    if (newQty < 1) return;

    updateQuantity(productId, newQty);
    refreshCart();
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
        await createOrderItem({
          orderId: newOrderId,
          productId: item.productId,
          quantity: item.quantity,
          price: Number(item.price),
        }).unwrap();
      }

      toast.success("✅ Order placed successfully!");

      await Swal.fire({
        title: "Success!",
        text: `✅ Order #${newOrderId} placed successfully.`,
        icon: "success",
        confirmButtonColor: "#2563eb",
      });

    } catch (error: any) {
      toast.error("❌ Failed to create order");

      Swal.fire({
        title: "Error!",
        text: "❌ Something went wrong while placing your order.",
        icon: "error",
        confirmButtonColor: "#d33",
      });

    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteOrder = async () => {
    if (!orderId) return;

    const itemList = cartItems
      .map((item) => `- ${item.title} (Qty: ${item.quantity})`)
      .join("\n");

    const result = await Swal.fire({
      title: "Are you sure you want to delete the order?",
      html: `<pre style="text-align:left">${itemList}</pre>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteOrder(orderId).unwrap();
      setOrderId(null);

      await Swal.fire({
        title: "Deleted!",
        text: "🗑️ Order deleted successfully.",
        icon: "success",
        confirmButtonColor: "#2563eb"
      });

    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "❌ Failed to delete order.",
        icon: "error",
        confirmButtonColor: "#d33"
      });
    }
  };

 const handleInitiateMpesaPayment = async () => {
  if (!orderId || total <= 0) return;

  let formattedPhone = "";

  const { value: inputPhone } = await Swal.fire({
    title: "Enter Phone Number to Pay",
    html: `
      <p style="text-align:left">📦 <strong>Order ID:</strong> ${orderId}</p>
      <p style="text-align:left">💵 <strong>Amount:</strong> Ksh ${total.toFixed(2)}</p>
      <p style="margin-top:10px;">Enter a valid Safaricom number:</p>
    `,
    input: "text",
    inputLabel: "Safaricom Number",
    inputPlaceholder: "e.g. 2547XXXXXXXX, 07XXXXXXXX, 01XXXXXXXX",
    inputAttributes: {
      maxlength: "13",
      autocapitalize: "off",
      autocorrect: "off",
    },
    confirmButtonText: "Pay Now",
    showCancelButton: true,
    inputValidator: (value) => {
      try {
        formattedPhone = formatPhoneNumber(value);
        return null;
      } catch (err: any) {
        return err.message;
      }
    },
  });

  if (inputPhone) {
    try {
      const confirmation = await Swal.fire({
        title: "Confirm Payment",
        html: `
          <p>📞 <strong>Phone:</strong> ${formattedPhone}</p>
          <p>📦 <strong>Order ID:</strong> ${orderId}</p>
          <p>💵 <strong>Amount:</strong> Ksh ${total.toFixed(2)}</p>
        `,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Confirm & Pay",
        cancelButtonText: "Cancel",
      });

      if (!confirmation.isConfirmed) return;

      const res = await initiateSTKPush({
        orderId,
        phoneNumber: formattedPhone,
        amount: total,
      }).unwrap();

      if (res?.ResponseCode === "0") {
        Swal.fire({
          icon: "info",
          title: "Check your phone 📲",
          text: res?.ResponseDescription || "STK Push sent successfully.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "STK Push Failed",
          text: res?.ResponseDescription || "Payment request was rejected.",
        });
      }
    } catch (error: any) {
      console.error("❌ STK Push Error:", error);
      Swal.fire({
        icon: "error",
        title: "STK Push Failed",
        text:
          error?.data?.details ||
          error?.data?.error ||
          "An error occurred. Please try again.",
      });
    }
  }
};


  const formatPhoneNumber = (input: string): string => {
    const phone = input.trim().replace(/^\+/, "");

    if (/^254\d{9}$/.test(phone)) return phone;
    if (/^07\d{8}$/.test(phone)) return `254${phone.slice(1)}`;
    if (/^01\d{8}$/.test(phone)) return `254${phone.slice(1)}`;

    throw new Error("📵 Invalid Safaricom number format");
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
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() => handleQtyChange(item.productId, -1)}
                          className="px-2 py-1 rounded bg-gray-600 hover:bg-amber-950"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => handleQtyChange(item.productId, 1)}
                          className="px-2 py-1 rounded bg-gray-600 hover:bg-amber-950"
                        >
                          +
                        </button>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        Unit: Ksh {Number(item.price).toFixed(2)} <br />
                        Total: Ksh {(item.quantity * Number(item.price)).toFixed(2)}
                      </p>
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
                    onClick={handleInitiateMpesaPayment}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  >
                    Pay with M-Pesa
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
