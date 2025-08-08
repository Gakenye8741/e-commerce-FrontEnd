// src/Features/Apis/OrderItemApis.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../App/store';

export interface OrderItem {
  orderItemId: number;
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
    // ✅ Get all order items (no arguments)
   getAllOrderItems: builder.query<{ items: OrderItem[]; message: string }, void>({
      query: () => 'AllOrderItems',
      providesTags: ['orderItem'],
    }),

    // ✅ Other endpoints
    createOrderItem: builder.mutation<OrderItem, Partial<OrderItem>>({
      query: (data) => ({
        url: 'create-OrderItem',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['orderItem', 'orderItemByOrder'],
    }),

    updateOrderItem: builder.mutation<
      OrderItem,
      { orderItemId: number; data: Partial<OrderItem> }
    >({
      query: ({ orderItemId, data }) => ({
        url: `update-OrderItem/${orderItemId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['orderItem', 'orderItemByOrder'],
    }),

    getOrderItemById: builder.query<OrderItem, number>({
      query: (orderItemId) => `OrderItem/${orderItemId}`,
      providesTags: ['orderItem'],
    }),

    getOrderItemsByOrderId: builder.query<OrderItem[], number>({
      query: (orderId) => `OrderItemsByOrder/${orderId}`,
      providesTags: ['orderItemByOrder'],
    }),

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
  useGetAllOrderItemsQuery,
  useCreateOrderItemMutation,
  useUpdateOrderItemMutation,
  useGetOrderItemByIdQuery,
  useGetOrderItemsByOrderIdQuery,
  useDeleteOrderItemMutation,
} = orderItemsApi;
