import { PuffLoader } from "react-spinners";
import { useGetAllOrdersQuery } from "../../Features/Apis/ordersApi";

export default function ManageOrders() {
  const { data: ordersRaw, isLoading, isError } = useGetAllOrdersQuery();
  const orders = ordersRaw?.allOrders || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <PuffLoader color="#22d3ee" size={60} />
      </div>
    );
  }

  if (isError || orders.length === 0) {
    return (
      <div className="p-6 text-error text-center font-semibold">
        ⚠️ No orders found.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-primary">🧾 Manage Orders</h1>

      {orders.map((order) => (
        <div
          key={order.orderId}
          className="card bg-base-100 shadow-md p-4"
        >
          <h2 className="text-lg font-bold">Order #{order.orderId}</h2>
          <p>User ID: {order.userId}</p>
          <p>Status: <span className="badge badge-info">{order.status}</span></p>
          <p>Total: <span className="text-primary">Ksh {parseFloat(order.totalAmount.toString()).toFixed(2)}</span></p>
          <p className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
