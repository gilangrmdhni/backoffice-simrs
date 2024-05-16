import { COAType } from '@/types';
import { apiSlice } from '../apiSlice';

export const COAApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCOA: builder.query({
            query: (params) => `/COA?${new URLSearchParams(params).toString()}`,
        }),
        deleteCOA: builder.mutation({
            query: (id?: number) => {
                return {
                    url: `/COA/${id}`,
                    method: 'DELETE',
                };
            },
        }),
        postCOA: builder.mutation({
            query: (body: COAType) => {
                return {
                    url: 'COA',
                    method: 'POST',
                    body: body,
                };
            },
        }),
        updateCOA: builder.mutation({
            query: (body: COAType) => {
                return {
                    url: 'COA',
                    method: 'PUT',
                    body: body,
                };
            },
        }),
        getDetailCOA: builder.query({
            query: (id?: string) => `/COA/${id}`,
        }),
    }),
});

export const { useGetCOAQuery, useDeleteCOAMutation, usePostCOAMutation, useUpdateCOAMutation, useGetDetailCOAQuery } = COAApi;
