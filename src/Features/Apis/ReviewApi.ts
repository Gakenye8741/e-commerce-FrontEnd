import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const reviewApi = createApi({
  reducerPath: 'reviewApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://e-commerce-backend-esgr.onrender.com/api/',
  }),
  tagTypes: ['reviews', 'review'],
  endpoints: (builder) => ({
    // 📥 Get all reviews
    getAllReviews: builder.query({
      query: () => 'AllReviews',
      providesTags: ['reviews'],
    }),

    // 🔍 Get review by ID
    getReviewById: builder.query({
      query: (reviewId) => `Review/${reviewId}`,
      providesTags: ['review'],
    }),

    // 🛍️ Get reviews for a product
    getReviewsByProductId: builder.query({
      query: (productId) => `ProductReviews/${productId}`,
      providesTags: ['reviews'],
    }),

    // 👤 Get reviews by user
    getReviewsByUserId: builder.query({
      query: (userId) => `UserReviews/${userId}`,
      providesTags: ['reviews'],
    }),

    // ➕ Create a new review
    createReview: builder.mutation({
      query: (reviewData) => ({
        url: 'create-Review',
        method: 'POST',
        body: reviewData,
      }),
      invalidatesTags: ['reviews'],
    }),

    // ✏️ Update a review
    updateReview: builder.mutation({
      query: ({ reviewId, ...updatedFields }) => ({
        url: `update-Review/${reviewId}`,
        method: 'PUT',
        body: updatedFields,
      }),
      invalidatesTags: ['reviews', 'review'],
    }),

    // 🗑️ Delete a review
    deleteReview: builder.mutation({
      query: (reviewId) => ({
        url: `delete-Review/${reviewId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['reviews'],
    }),
  }),
});

export const {
  useGetAllReviewsQuery,
  useGetReviewByIdQuery,
  useGetReviewsByProductIdQuery,
  useGetReviewsByUserIdQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewApi;
