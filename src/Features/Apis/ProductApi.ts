import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api/' }),
  tagTypes: ['products', 'product'],
  endpoints: (builder) => ({
    // 📦 Get All Products
    getAllProducts: builder.query({
      query: () => 'All-Products',
      providesTags: ['products'],
    }),

    // 🔍 Get Product by ID
    getProductById: builder.query({
      query: (productId) => `Product/${productId}`,
      providesTags: ['product'],
    }),

    // 🔍 Search Product by Title
    searchProductsByTitle: builder.query({
      query: (title) => `search-product?title=${title}`,
    }),

    // ➕ Create New Product
    createProduct: builder.mutation({
      query: (newProductData) => ({
        url: 'create-Product',
        method: 'POST',
        body: newProductData,
      }),
      invalidatesTags: ['products'],
    }),

    // ✏️ Update Product
   updateProduct: builder.mutation({
  query: ({ productId, title, description, price, stock, subcategoryId }) => ({
    url: `update-Product/${productId}`,
    method: 'PUT',
    body: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price }),
      ...(stock !== undefined && { stock }),
      ...(subcategoryId !== undefined && { subcategoryId }),
    },
  }),
  invalidatesTags: ['products', 'product'],
}),


    // 🗑️ Delete Product
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `delete-Product/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['products', 'product'],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useSearchProductsByTitleQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
