
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const orderItemsApi = createApi({
  reducerPath: 'orderItemsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://e-commerce-backend-esgr.onrender.com/api/' }),
  tagTypes: ['orderItems', 'orderItem'],
  endpoints: (builder) => ({
    // 📦 Get All Order Items
    getAllOrderItems: builder.query({
      query: () => 'AllOrderItems',
      providesTags: ['orderItems'],
    }),

    // 🔍 Get Order Item by ID
    getOrderItemById: builder.query({
      query: (orderItemId) => `OrderItem/${orderItemId}`,
      providesTags: ['orderItem'],
    }),

    // 🔍 Get Order Items by Order ID
    getOrderItemsByOrderId: builder.query({
      query: (orderId) => `OrderItemsByOrder/${orderId}`,
      providesTags: ['orderItems'],
    }),

    // ➕ Create Order Item
    createOrderItem: builder.mutation({
      query: (orderItemData) => ({
        url: 'create-OrderItem',
        method: 'POST',
        body: orderItemData,
      }),
      invalidatesTags: ['orderItems'],
    }),

    // ✏️ Update Order Item
    updateOrderItem: builder.mutation({
      query: ({ orderItemId, ...updateData }) => ({
        url: `update-OrderItem/${orderItemId}`,
        method: 'PUT',
        body: updateData,
      }),
      invalidatesTags: ['orderItems', 'orderItem'],
    }),

    // 🗑️ Delete Order Item
    deleteOrderItem: builder.mutation({
      query: (orderItemId) => ({
        url: `delete-OrderItem/${orderItemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['orderItems'],
    }),
  }),
});

// ✅ Export hooks
export const {
  useGetAllOrderItemsQuery,
  useGetOrderItemByIdQuery,
  useGetOrderItemsByOrderIdQuery,
  useCreateOrderItemMutation,
  useUpdateOrderItemMutation,
  useDeleteOrderItemMutation,
} = orderItemsApi;
