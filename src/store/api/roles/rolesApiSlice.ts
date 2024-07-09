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
        exportRoles: builder.mutation({
            query: ({ type, keyword, orderBy, orderType }) => ({
                url: `Role/export?type=${type}&keyword=${keyword}&orderBy=${orderBy}&orderType=${orderType}`,
                method: 'GET',
                responseHandler: (response) => response.blob(),
            }),
            transformResponse: (response: Blob) => response,
        }),
    }),
});

export const { useGetRolesQuery, useDeleteRolesMutation, usePostRolesMutation, useUpdateRolesMutation, useGetDetailRolesQuery, useGetOptionRolesQuery, useExportRolesMutation } = rolesApi;
