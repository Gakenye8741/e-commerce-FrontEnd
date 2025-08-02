import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../App/store';

interface Category {
  id: string; // or use `_id` if your backend uses that instead
  name: string;
  [key: string]: any; // if categories contain more fields
}

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api/',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: true,
  tagTypes: ['categories', 'category'],

  endpoints: (builder) => ({
    // ➕ Create Category
    createCategory: builder.mutation<void, { name: string ,imageUrl:string}>({
      query: (newCategory) => ({
        url: 'add-category',
        method: 'POST',
        body: newCategory,
      }),
      invalidatesTags: [{ type: 'categories', id: 'LIST' }],
    }),

    // 🔄 Update Category
    updateCategory: builder.mutation<void, { categoryId: string; name: string ,imageUrl:string}>({
      query: ({ categoryId, ...body }) => ({
        url: `update-category/${categoryId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { categoryId }) => [
        { type: 'categories', id: categoryId },
        { type: 'categories', id: 'LIST' },
      ],
    }),

    // 🗑️ Delete Category
    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `delete-category/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'categories', id },
        { type: 'categories', id: 'LIST' },
      ],
    }),

    // 📥 Get All Categories
    getAllCategories: builder.query<Category[], void>({
      query: () => 'all-categories',
      transformResponse: (response: any) => {
        if (Array.isArray(response)) return response;
        if (Array.isArray(response?.categories)) return response.categories;
        return [];
      },
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              ...result.map((cat) => ({ type: 'categories' as const, id: cat.id || cat._id })),
              { type: 'categories', id: 'LIST' },
            ]
          : [{ type: 'categories', id: 'LIST' }],
    }),

    // 📥 Get All Categories with Subcategories
    getAllCategoriesWithSubcategories: builder.query<Category[], void>({
      query: () => 'all-categories-with-subcategories',
      providesTags: [{ type: 'categories', id: 'LIST' }],
    }),

    // 🔍 Get Category by ID
    getCategoryById: builder.query<Category, string>({
      query: (id) => `category/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'category', id }],
    }),

    // 🔍 Get Category by Name
    getCategoryByName: builder.query<Category, string>({
      query: (name) => `category-name/${name}`,
      providesTags: ['category'],
    }),

    // 🔎 Search Categories (partial name)
    searchCategoriesByName: builder.query<Category[], string>({
      query: (queryStr) => `search-categories?name=${queryStr}`,
      providesTags: [{ type: 'categories', id: 'LIST' }],
    }),

    // 📥 Get One Category with Subcategories
    getCategoryWithSubcategories: builder.query<any, string>({
      query: (id) => `category-with-subcategories/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'category', id }],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useGetAllCategoriesWithSubcategoriesQuery,
  useGetCategoryByIdQuery,
  useGetCategoryByNameQuery,
  useSearchCategoriesByNameQuery,
  useGetCategoryWithSubcategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
