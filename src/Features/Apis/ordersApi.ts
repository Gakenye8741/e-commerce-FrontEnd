import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../App/store'; // <-- Make sure the path is correct

export interface Order {
  orderId: number;
  userId: number;
  totalAmount: string;
  status: 'pending' | 'Completed'  | 'cancelled';
  createdAt: string;
}

interface CreateOrderResponse {
  message: string;
  order: Order;
}

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://e-commerce-backend-esgr.onrender.com/api/',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['orders', 'order'],
  endpoints: (builder) => ({
    // 📦 Get All Orders
   getAllOrders: builder.query<{ allOrders: Order[] }, void>({
  query: () => 'AllOrders',
  providesTags: ['orders'],
}),

    // 🔍 Get Order by ID
    getOrderById: builder.query<Order, number>({
      query: (orderId) => `Order/${orderId}`,
      providesTags: ['order'],
    }),

    // 👤 Get Orders by User ID
    getOrdersByUserId: builder.query<Order[], number>({
      query: (userId) => `UserOrders/${userId}`,
      providesTags: ['orders'],
    }),

    // ➕ Create Order
    createOrder: builder.mutation<Order, { userId: number; totalAmount: number }>({
      query: (orderData) => ({
        url: 'create-Order',
        method: 'POST',
        body: orderData,
      }),
      transformResponse: (response: CreateOrderResponse) => response.order,
      invalidatesTags: ['orders'],
    }),

    // ✏️ Update Order
    updateOrder: builder.mutation<Order, { orderId: number; data: Partial<Order> }>({
      query: ({ orderId, data }) => ({
        url: `update-Order/${orderId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['orders', 'order'],
    }),

    // 🗑️ Delete Order
    deleteOrder: builder.mutation<{ success: boolean }, number>({
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
