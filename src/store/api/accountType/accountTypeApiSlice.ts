import { apiSlice } from '../apiSlice';

export const accountTypeApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAccountTypes: builder.query({
            query: ({ orderBy = 'AccountTypeId', orderType = 'asc', page = 1, pageSize = 10, keyword = '' }) =>
                `/AccountType?orderBy=${orderBy}&orderType=${orderType}&page=${page}&pageSize=${pageSize}&keyword=${keyword}`,
        }),
        deleteAccountType: builder.mutation({
            query: (id) => ({
                url: `/AccountType/${id}`,
                method: 'DELETE',
            }),
        }),
        createAccountType: builder.mutation({
            query: (body) => ({
                url: '/AccountType',
                method: 'POST',
                body: body,
            }),
        }),
        updateAccountType: builder.mutation({
            query: (body) => ({
                url: '/AccountType',
                method: 'PUT',
                body: body,
            }),
        }),
        getAccountTypeDetail: builder.query({
            query: (id) => `/AccountType/${id}`,
        }),
        getOptionAccountTypeOption: builder.query({
            query: (params) => `/AccountType/option?${new URLSearchParams(params).toString()}`,
        }),
    }),
});

export const {
    useGetAccountTypesQuery,
    useDeleteAccountTypeMutation,
    useCreateAccountTypeMutation,
    useUpdateAccountTypeMutation,
    useGetAccountTypeDetailQuery,
    useGetOptionAccountTypeOptionQuery,
} = accountTypeApi;
