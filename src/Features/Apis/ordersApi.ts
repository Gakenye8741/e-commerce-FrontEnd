import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://e-commerce-backend-esgr.onrender.com/api/' }),
  tagTypes: ['orders', 'order'],
  endpoints: (builder) => ({
    // 📦 Get All Orders
    getAllOrders: builder.query({
      query: () => 'AllOrders',
      providesTags: ['orders'],
    }),

    // 🔍 Get Order by ID
    getOrderById: builder.query({
      query: (orderId) => `Order/${orderId}`,
      providesTags: ['order'],
    }),

    // 👤 Get Orders by User ID
    getOrdersByUserId: builder.query({
      query: (userId) => `UserOrders/${userId}`,
      providesTags: ['orders'],
    }),

    // ➕ Create Order
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: 'create-Order',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['orders'],
    }),

    // ✏️ Update Order
    updateOrder: builder.mutation({
      query: ({ orderId, ...updateData }) => ({
        url: `update-Order/${orderId}`,
        method: 'PUT',
        body: updateData,
      }),
      invalidatesTags: ['orders', 'order'],
    }),

    // 🗑️ Delete Order
    deleteOrder: builder.mutation({
      query: (orderId) => ({
        url: `delete-Order/${orderId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['orders'],
    }),
  }),
});

// ✅ Export hooks
export const {
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useGetOrdersByUserIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = ordersApi;
