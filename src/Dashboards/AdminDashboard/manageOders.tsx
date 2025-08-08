import React, { useState, useEffect } from "react";
import { PuffLoader } from "react-spinners";
import { FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

import {
  useGetAllOrdersQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} from "../../Features/Apis/ordersApi";

import {
  useGetAllOrderItemsQuery,
  useUpdateOrderItemMutation,
} from "../../Features/Apis/OrderItemApis";

import { useGetAllProductsQuery } from "../../Features/Apis/ProductApi";
import { useGetAllUsersQuery } from "../../Features/Apis/userApi";

export default function ManageOrders() {
  const { data: ordersRaw, isLoading: ordersLoading, isError: ordersError, refetch } = useGetAllOrdersQuery();
  const { data: orderItemsRaw, isLoading: itemsLoading, isError: itemsError } = useGetAllOrderItemsQuery();
  const { data: productData } = useGetAllProductsQuery(undefined);
  const { data: userData } = useGetAllUsersQuery(undefined);

  const [updateOrder] = useUpdateOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();
  const [updateOrderItem] = useUpdateOrderItemMutation();

  const orders = ordersRaw?.allOrders ?? [];
  const orderItems = Array.isArray(orderItemsRaw) ? orderItemsRaw : orderItemsRaw?.items ?? [];
  const products = productData?.allProducts ?? [];
  const users = userData?.AllUsers ?? [];

  const [isEditing, setIsEditing] = useState(false);
  const [currentEdit, setCurrentEdit] = useState<any>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const filteredOrders = orders.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(orders.length / pageSize);

  const getProductName = (productId: number) =>
    products.find((p: any) => p.productId === productId)?.title || `⚠️ Unknown Product (ID: ${productId})`;

  const getUserName = (userId: number) => {
    const user = users.find((u: any) => u.userId === userId);
    return user ? `${user.firstName} ${user.lastName}` : `Unknown User (ID: ${userId})`;
  };

  const openEditModal = (item: any) => {
    setCurrentEdit({
      orderItemId: item.orderItemId,
      quantity: item.quantity,
      price: item.price,
    });
    setIsEditing(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentEdit({ ...currentEdit, [name]: value });
  };

  const handleEditSubmit = async () => {
    try {
      await updateOrderItem({
        orderItemId: currentEdit.orderItemId,
        data: {
          quantity: Number(currentEdit.quantity),
          price: parseFloat(currentEdit.price),
        },
      }).unwrap();
      Swal.fire("✅ Success", "Order item updated successfully!", "success");
      setIsEditing(false);
      refetch();
    } catch (error) {
      Swal.fire("❌ Error", "Failed to update order item.", "error");
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the order and its associated items permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteOrder(orderId).unwrap();
        Swal.fire("Deleted!", "Order has been deleted.", "success");
        refetch();
      } catch {
        Swal.fire("❌ Error", "Failed to delete order.", "error");
      }
    }
  };

  // Auto-update backend total if mismatch
  useEffect(() => {
    orders.forEach((order: any) => {
      const itemsForOrder = orderItems.filter((item) => item.orderId === order.orderId);
      const calculatedTotal = itemsForOrder.reduce(
        (sum, item) => sum + item.quantity * parseFloat(item.price || "0"),
        0
      );
      const savedTotal = parseFloat(order.totalAmount);
      if (savedTotal.toFixed(2) !== calculatedTotal.toFixed(2)) {
        updateOrder({
          orderId: order.orderId,
          data: { totalAmount: calculatedTotal },
        });
      }
    });
  }, [orders, orderItems, updateOrder]);

  if (ordersLoading || itemsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <PuffLoader color="#22d3ee" size={60} />
      </div>
    );
  }

  if (ordersError || itemsError) {
    return (
      <div className="p-6 text-error text-center font-semibold">
        ⚠️ Failed to load data.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-primary">🧾 Manage Orders</h1>

      {/* Page size selector */}
      <div className="flex justify-end">
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(1);
          }}
          className="select select-bordered w-32"
        >
          {[5, 10, 20, 50].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>

      {filteredOrders.map((order) => {
        const itemsForOrder = orderItems.filter((item) => item.orderId === order.orderId);
        const computedTotal = itemsForOrder.reduce(
          (sum, item) => sum + item.quantity * parseFloat(item.price || "0"),
          0
        );

        return (
          <div key={order.orderId} className="card bg-base-100 shadow-md p-4 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold">Order #{order.orderId}</h2>
                <p>User: {getUserName(order.userId)} (ID: {order.userId})</p>
                <p>Status: <span className="badge badge-info">{order.status}</span></p>
                <p>Total: <span className="text-primary">Ksh {computedTotal.toFixed(2)}</span></p>
                <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <button
                onClick={() => handleDeleteOrder(order.orderId)}
                className="btn btn-sm btn-error"
              >
                Delete Order
              </button>
            </div>

            <div className="overflow-x-auto">
              {itemsForOrder.length > 0 ? (
                <table className="table table-zebra w-full">
                  <thead>
                    <tr className="bg-base-200 text-sm text-primary">
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Unit Price (Ksh)</th>
                      <th>Total (Ksh)</th>
                      <th>Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemsForOrder.map((item) => {
                      const unitPrice = parseFloat(item.price || "0");
                      const total = unitPrice * item.quantity;

                      return (
                        <tr key={item.orderItemId}>
                          <td>{getProductName(item.productId)}</td>
                          <td>{item.quantity}</td>
                          <td>{unitPrice.toFixed(2)}</td>
                          <td>{total.toFixed(2)}</td>
                          <td>
                            <button
                              onClick={() => openEditModal(item)}
                              className="btn btn-sm btn-info"
                            >
                              <FaEdit />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <p className="text-sm text-error">⚠️ No items found for this order.</p>
              )}
            </div>
          </div>
        );
      })}

      {/* Pagination Controls */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          className="btn btn-sm"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="text-sm font-semibold">Page {page} of {totalPages}</span>
        <button
          className="btn btn-sm"
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && currentEdit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-base-100 rounded-lg p-6 w-full max-w-md shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-4 text-primary">Edit Order Item</h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={currentEdit.quantity}
                    onChange={handleEditChange}
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">Price (Ksh)</label>
                  <input
                    type="text"
                    name="price"
                    value={currentEdit.price}
                    onChange={handleEditChange}
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button onClick={() => setIsEditing(false)} className="btn btn-ghost">
                    Cancel
                  </button>
                  <button onClick={handleEditSubmit} className="btn btn-primary">
                    Save
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
