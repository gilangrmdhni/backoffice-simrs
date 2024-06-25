import { branchType } from '@/types';
import { apiSlice } from '../apiSlice';

export const branchApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getBranch: builder.query({
            query: ({ orderBy = 'BranchId', orderType = 'asc', page = 1, pageSize = 10, keyword = '', status = '' }) =>
                `/Branch?orderBy=${orderBy}&orderType=${orderType}&page=${page}&pageSize=${pageSize}&keyword=${keyword}&status=${status}`,
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
        getOptionBranch: builder.query({
            query: (params) => `/branch/option?${new URLSearchParams(params).toString()}`,
        }),
        exportBranch: builder.mutation({
            query: ({ type, keyword, orderBy, orderType, status }) => ({
                url: `Branch/export?type=${type}&keyword=${keyword}&orderBy=${orderBy}&orderType=${orderType}&status=${status}`,
                method: 'GET',
                responseHandler: (response) => response.blob(),
            }),
            transformResponse: (response: Blob) => response,
        }),
    }),
});

export const {
    useGetBranchQuery,
    useDeleteBranchMutation,
    usePostBranchMutation,
    useUpdateBranchMutation,
    useGetDetailBranchQuery,
    useGetOptionBranchQuery,
    useExportBranchMutation,
} = branchApi;
