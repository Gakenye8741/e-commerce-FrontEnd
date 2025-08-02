import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api/' }),
  tagTypes: ['users', 'user'],
  endpoints: (builder) => ({
    // 🔐 Auth Endpoints
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    registerUser: builder.mutation({
      query: (newUser) => ({
        url: 'auth/register',
        method: 'POST',
        body: newUser,
      }),
    }),

    requestPasswordReset: builder.mutation({
      query: (emailPayload) => ({
        url: 'auth/password-reset',
        method: 'POST',
        body: emailPayload,
      }),
    }),

    resetPassword: builder.mutation({
      query: ({ token, newPasswordPayload }) => ({
        url: `auth/reset/${token}`,
        method: 'PUT',
        body: newPasswordPayload,
      }),
    }),

    verifyEmail: builder.mutation({
      query: (verificationPayload) => ({
        url: 'auth/verify-email',
        method: 'PUT',
        body: verificationPayload,
      }),
    }),

    // 👤 User Endpoints
    getAllUsers: builder.query({
      query: () => 'AllUsers',
      providesTags: ['users'],
    }),

    getUserById: builder.query({
      query: (userId) => `User/${userId}`,
      providesTags: ['user'],
    }),

    getAllUserDetails: builder.query({
      query: (userId) => `get-All-User-Details/${userId}`,
      providesTags: ['user'],
    }),

    createUser: builder.mutation({
      query: (newUserData) => ({
        url: 'create-User',
        method: 'POST',
        body: newUserData,
      }),
      invalidatesTags: ['users'],
    }),

    updateUser: builder.mutation({
      query: ({ userId, ...updatePayload }) => ({
        url: `update-User/${userId}`,
        method: 'PUT',
        body: updatePayload,
      }),
      invalidatesTags: ['user', 'users'],
    }),

    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `delete-User/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['user', 'users'],
    }),

    searchUsersByLastName: builder.query({
      query: (lastName) => `search-user?lastName=${lastName}`,
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,

  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useGetAllUserDetailsQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useSearchUsersByLastNameQuery,
} = userApi;
