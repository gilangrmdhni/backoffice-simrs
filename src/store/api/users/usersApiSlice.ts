import { usersType } from '@/types';
import { apiSlice } from '../apiSlice';

export const usersApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: (params) => `/User?${new URLSearchParams(params).toString()}`,
        }),
        deleteUsers: builder.mutation({
            query: (id?: number) => {
                return {
                    url: `/User/${id}`,
                    method: 'DELETE',
                };
            },
        }),
        postUsers: builder.mutation({
            query: (body: usersType) => {
                return {
                    url: 'User',
                    method: 'POST',
                    body: body,
                };
            },
        }),
        updateUsers: builder.mutation({
            query: (body: usersType) => {
                return {
                    url: 'User',
                    method: 'PUT',
                    body: body,
                };
            },
        }),
        getDetailUsers: builder.query({
            query: (id?: string) => `/User/${id}`,
        }),
    }),
});

export const { useGetUsersQuery, useDeleteUsersMutation, usePostUsersMutation, useUpdateUsersMutation, useGetDetailUsersQuery } = usersApi;
