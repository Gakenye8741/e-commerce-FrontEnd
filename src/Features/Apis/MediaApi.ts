import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../App/store';


export interface ImageData {
  productId: number;
  url: string;
  alt?: string;
}


export const mediaApi = createApi({
  reducerPath: 'mediaApi',
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
  tagTypes: ['image', 'imageByProduct'],
  endpoints: (builder) => ({
    // ➕ Create Image
    createImage: builder.mutation({
      query: (data: ImageData) => ({
        url: 'create-Image',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['image'],
    }),

    // 🔄 Update Image
    updateImage: builder.mutation({
      query: ({ imageId, ...data }) => ({
        url: `update-Image/${imageId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['image'],
    }),

    // 📥 Get All Images
    getAllImages: builder.query({
      query: () => 'AllImages',
      providesTags: ['image'],
    }),

    // 📥 Get Image by ID
    getImageById: builder.query({
      query: (imageId: number) => `Image/${imageId}`,
      providesTags: ['image'],
    }),

    // 📥 Get Images by Product ID
    getImagesByProductId: builder.query({
      query: (productId: number) => `ProductImages/${productId}`,
      providesTags: ['imageByProduct'],
    }),

    // ❌ Delete Image
    deleteImage: builder.mutation({
      query: (imageId: number) => ({
        url: `delete-Image/${imageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['image'],
    }),
  }),
});

export const {
  useCreateImageMutation,
  useUpdateImageMutation,
  useGetAllImagesQuery,
  useGetImageByIdQuery,
  useGetImagesByProductIdQuery,
  useDeleteImageMutation,
} = mediaApi;
