import { branchType } from '@/types';
import { apiSlice } from '../apiSlice';

export const branchApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getBranch: builder.query({
            query: ({ orderBy = 'BranchId', orderType = 'asc', page = 1, pageSize = 10 }) =>
                `/Branch?orderBy=${orderBy}&orderType=${orderType}&page=${page}&pageSize=${pageSize}`,
        }),
        deleteBranch: builder.mutation({
            query: (id?: number) => {
                return {
                    url: `/Branch/${id}`,
                    method: 'DELETE',
                };
            },
        }),
        postBranch: builder.mutation({
            query: (body: branchType) => {
                return {
                    url: 'Branch',
                    method: 'POST',
                    body: body,
                };
            },
        }),
        updateBranch: builder.mutation({
            query: (body: branchType) => {
                return {
                    url: 'Branch',
                    method: 'PUT',
                    body: body,
                };
            },
        }),
        getDetailBranch: builder.query({
            query: (id?: string) => `/Branch/${id}`,
        }),
    }),
});

export const {
    useGetBranchQuery,
    useDeleteBranchMutation,
    usePostBranchMutation,
    useUpdateBranchMutation,
    useGetDetailBranchQuery
} = branchApi;

