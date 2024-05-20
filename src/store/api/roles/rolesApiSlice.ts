import { usersType } from '@/types';
import { apiSlice } from '../apiSlice';

export const rolesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getRoles: builder.query({
            query: (params) => `/Role?${new URLSearchParams(params).toString()}`,
        }),
        deleteRoles: builder.mutation({
            query: (id?: number) => {
                return {
                    url: `/Role/${id}`,
                    method: 'DELETE',
                };
            },
        }),
        postRoles: builder.mutation({
            query: (body: usersType) => {
                return {
                    url: '/Role',
                    method: 'POST',
                    body: body,
                };
            },
        }),
        updateRoles: builder.mutation({
            query: (body: usersType) => {
                return {
                    url: '/Role',
                    method: 'PUT',
                    body: body,
                };
            },
        }),
        getDetailRoles: builder.query({
            query: (id?: string) => `/Role/${id}`,
        }),
        getOptionRoles: builder.query({
            query: (params) => `/Role/option?${new URLSearchParams(params).toString()}`,
        }),
    }),
});

export const { useGetRolesQuery, useDeleteRolesMutation, usePostRolesMutation, useUpdateRolesMutation, useGetDetailRolesQuery, useGetOptionRolesQuery } = rolesApi;
