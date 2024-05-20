import { apiSlice } from '../apiSlice';

export const accountTypeApi = apiSlice.injectEndpoints({
    endpoints: (builder:any) => ({
        getAccountTypes: builder.query({
            query: ({ orderBy = 'AccountTypeId', orderType = 'asc', page = 1, pageSize = 10 }) =>
                `/AccountType?orderBy=${orderBy}&orderType=${orderType}&page=${page}&pageSize=${pageSize}`,
        }),
        deleteAccountType: builder.mutation({
            query: (id:any) => ({
                url: `/AccountType/${id}`,
                method: 'DELETE',
            }),
        }),
        createAccountType: builder.mutation({
            query: (body : any) => ({
                url: '/AccountType',
                method: 'POST',
                body: body,
            }),
        }),
        updateAccountType: builder.mutation({
            query: (body : any) => ({
                url: '/AccountType',
                method: 'PUT',
                body: body,
            }),
        }),
        getAccountTypeDetail: builder.query({
            query: (id:any) => `/AccountType/${id}`,
        }),
        getOptionAccountTypeOption: builder.query({
            query: (params:any) => `/AccountType/option?${new URLSearchParams(params).toString()}`,
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
