import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../App/store";

export interface Subcategory {
  subcategoryId: number | string;
  name: string;
  categoryId: number | string;
  imageUrl?: string | null;
  createdAt?: string;
}

export const subcategoryApi = createApi({
  reducerPath: "subcategoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`); // add Bearer prefix here if needed
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: true,
  tagTypes: ["Subcategories", "Subcategory"],
  endpoints: (builder) => ({
    // GET all subcategories
    getAllSubcategories: builder.query<Subcategory[], void>({
      query: () => "all-subcategories",
      transformResponse: (res: any) =>
        Array.isArray(res?.subcategories) ? res.subcategories : [],
      providesTags: ["Subcategories"],
    }),

    // GET subcategory by ID
    getSubcategoryById: builder.query<Subcategory, string | number>({
      query: (subcategoryId) => `subcategory/${subcategoryId}`,
      providesTags: (_res, _err, id) => [{ type: "Subcategory", id }],
    }),

    // POST create subcategory (requires auth)
    createSubcategory: builder.mutation<
      void,
      Omit<Subcategory, "subcategoryId" | "createdAt">
    >({
      query: (body) => ({
        url: "add-subcategory",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Subcategories"],
    }),

    // PUT update subcategory (requires auth)
    updateSubcategory: builder.mutation<
      void,
      { subcategoryId: string | number; name: string; categoryId: string | number; imageUrl?: string | null }
    >({
      query: ({ subcategoryId, ...body }) => ({
        url: `update-subcategory/${subcategoryId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_res, _err, { subcategoryId }) => [
        "Subcategories",
        { type: "Subcategory", id: subcategoryId },
      ],
    }),

    // DELETE subcategory (requires auth)
    deleteSubcategory: builder.mutation<void, string | number>({
      query: (subcategoryId) => ({
        url: `delete-subcategory/${subcategoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, id) => [
        "Subcategories",
        { type: "Subcategory", id },
      ],
    }),

    // GET subcategory with content (no tags, read-only)
    getSubcategoryWithContent: builder.query<any, string | number>({
      query: (subcategoryId) => `subcategory-content/${subcategoryId}`,
    }),
  }),
});

export const {
  useGetAllSubcategoriesQuery,
  useGetSubcategoryByIdQuery,
  useCreateSubcategoryMutation,
  useUpdateSubcategoryMutation,
  useDeleteSubcategoryMutation,
  useGetSubcategoryWithContentQuery,
} = subcategoryApi;
