import React, { useState } from "react";
import { PuffLoader } from "react-spinners";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  useDeleteOrderItemMutation,
  useGetAllOrderItemsQuery,
  useUpdateOrderItemMutation,
} from "../../Features/Apis/OrderItemApis";
import { useGetAllProductsQuery } from "../../Features/Apis/ProductApi";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

interface OrderItemEdit {
  orderItemId: number;
  quantity: number;
  price: string;
}

export default function ManageOrders() {
  const { data: orderItemsRaw, isLoading, isError } = useGetAllOrderItemsQuery();
  const { data: productData } = useGetAllProductsQuery(undefined);
  const [deleteOrderItem] = useDeleteOrderItemMutation();
  const [updateOrderItem] = useUpdateOrderItemMutation();

  const orderItems = Array.isArray(orderItemsRaw)
    ? orderItemsRaw
    : orderItemsRaw?.items ?? [];
  const products = productData?.allProducts ?? [];

  const [isEditing, setIsEditing] = useState(false);
  const [currentEdit, setCurrentEdit] = useState<OrderItemEdit | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [orderIdFilter, setOrderIdFilter] = useState("");

  const filteredItems = orderItems.filter((item: any) =>
    item.orderId.toString().includes(orderIdFilter.trim())
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const displayedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getProductName = (productId: number) =>
    products.find((p: any) => p.productId === productId)?.title ||
    `#${productId}`;

  const openEditModal = (item: any) => {
    setCurrentEdit({
      orderItemId: item.orderItemId,
      quantity: item.quantity,
      price: item.price,
    });
    setIsEditing(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentEdit) return;
    const { name, value } = e.target;
    setCurrentEdit({ ...currentEdit, [name]: value });
  };

  const handleEditSubmit = async () => {
    if (!currentEdit) return;
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
    } catch (error) {
      console.error("Update failed:", error);
      Swal.fire("❌ Error", "Failed to update order item.", "error");
    }
  };

  const handleDelete = async (orderItemId: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the order item permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteOrderItem(orderItemId).unwrap();
        Swal.fire("Deleted!", "Order item has been deleted.", "success");
      } catch (error) {
        console.error("Delete failed:", error);
        Swal.fire("❌ Error", "Failed to delete order item.", "error");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <PuffLoader color="#22d3ee" size={60} />
      </div>
    );
  }

  if (isError || orderItems.length === 0) {
    return (
      <div className="p-6 text-error text-center font-semibold">
        ⚠️ No order items found.
      </div>
    );
  }

  const grandTotal = displayedItems.reduce((sum: number, item: any) => {
    const unitPrice = parseFloat(item.price || "0");
    return sum + unitPrice * item.quantity;
  }, 0);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-primary">📦 Manage Order Items</h1>

      <div className="flex justify-between mb-4 items-center">
        <input
          type="text"
          placeholder="Filter by Order ID..."
          value={orderIdFilter}
          onChange={(e) => {
            setOrderIdFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="input input-bordered"
        />

        <select
          className="select select-bordered"
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
        >
          {[5, 10, 20, 50].map((size) => (
            <option key={size} value={size}>
              {size} per page
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-base-200 text-sm text-primary">
              <th>Order ID</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Unit Price (Ksh)</th>
              <th>Total (Ksh)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedItems.map((item: any) => {
              const unitPrice = parseFloat(item.price || "0");
              const totalPrice = unitPrice * item.quantity;

              return (
                <tr key={item.orderItemId}>
                  <td>{item.orderId}</td>
                  <td>{getProductName(item.productId)}</td>
                  <td>{item.quantity}</td>
                  <td>{unitPrice.toFixed(2)}</td>
                  <td>{totalPrice.toFixed(2)}</td>
                  <td className="space-x-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="btn btn-sm btn-info"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(item.orderItemId)}
                      className="btn btn-sm btn-error"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="text-right mt-4 font-bold text-lg text-primary">
        Page Total: Ksh {grandTotal.toFixed(2)}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`btn btn-sm ${page === currentPage ? "btn-primary" : "btn-ghost"}`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Edit Modal (Animated) */}
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
              <h3 className="text-xl font-semibold mb-4 text-primary">
                Edit Order Item
              </h3>
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
                  <button
                    onClick={() => setIsEditing(false)}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditSubmit}
                    className="btn btn-primary"
                  >
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
