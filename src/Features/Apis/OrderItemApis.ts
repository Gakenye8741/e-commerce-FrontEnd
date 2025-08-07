import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../App/store';

export interface OrderItem {
  id?: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
}

export const orderItemsApi = createApi({
  reducerPath: 'orderItemsApi',
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
  tagTypes: ['orderItem', 'orderItemByOrder'],
  endpoints: (builder) => ({
    // ➕ Create Order Item
    createOrderItem: builder.mutation<OrderItem, Partial<OrderItem>>({
      query: (data) => ({
        url: 'create-OrderItem',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['orderItem', 'orderItemByOrder'],
    }),

    // 🔄 Update Order Item
    updateOrderItem: builder.mutation<OrderItem, { orderItemId: number; data: Partial<OrderItem> }>({
      query: ({ orderItemId, data }) => ({
        url: `update-OrderItem/${orderItemId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['orderItem', 'orderItemByOrder'],
    }),

    // 📥 Get All Order Items
    getAllOrderItems: builder.query<OrderItem[], void>({
      query: () => 'AllOrderItems',
      providesTags: ['orderItem'],
    }),

    // 📥 Get Order Item by ID
    getOrderItemById: builder.query<OrderItem, number>({
      query: (orderItemId) => `OrderItem/${orderItemId}`,
      providesTags: ['orderItem'],
    }),

    // 📥 Get Order Items by Order ID
    getOrderItemsByOrderId: builder.query<OrderItem[], number>({
      query: (orderId) => `OrderItemsByOrder/${orderId}`,
      providesTags: ['orderItemByOrder'],
    }),

    // ❌ Delete Order Item
    deleteOrderItem: builder.mutation<{ success: boolean }, number>({
      query: (orderItemId) => ({
        url: `delete-OrderItem/${orderItemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['orderItem', 'orderItemByOrder'],
    }),
  }),
});

export const {
  useCreateOrderItemMutation,
  useUpdateOrderItemMutation,
  useGetAllOrderItemsQuery,
  useGetOrderItemByIdQuery,
  useGetOrderItemsByOrderIdQuery,
  useDeleteOrderItemMutation,
} = orderItemsApi;
