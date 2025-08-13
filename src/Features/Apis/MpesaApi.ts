import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../App/store';

interface STKPushRequest {
  phoneNumber: string;
  amount: number;
  orderId: number;
}

interface STKPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

export const mpesaApi = createApi({
  reducerPath: 'mpesaApi',
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
  endpoints: (builder) => ({
    initiateSTKPush: builder.mutation<STKPushResponse, STKPushRequest>({
      query: (data) => ({
        url: 'initiate-payment',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useInitiateSTKPushMutation } = mpesaApi;
