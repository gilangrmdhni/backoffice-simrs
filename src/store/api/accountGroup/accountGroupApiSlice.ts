import { apiSlice } from '../apiSlice';

export const accountGroupApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAccountGroups: builder.query({
            query: ({ orderBy = 'accountGroupId', orderType = 'asc', page = 1, pageSize = 10 }) =>
                `/AccountGroup?orderBy=${orderBy}&orderType=${orderType}&page=${page}&pageSize=${pageSize}`,
        }),
        deleteAccountGroup: builder.mutation({
            query: (id) => ({
                url: `/AccountGroup/${id}`,
                method: 'DELETE',
            }),
        }),
        createAccountGroup: builder.mutation({
            query: (body) => ({
                url: '/AccountGroup',
                method: 'POST',
                body: body,
            }),
        }),
        updateAccountGroup: builder.mutation({
            query: (body) => ({
                url: '/AccountGroup',
                method: 'PUT',
                body: body,
            }),
        }),
        getAccountGroupDetail: builder.query({
            query: (id) => `/AccountGroup/${id}`,
        }),

        getOptionGroupDetail: builder.query({
            query: (params) => `/AccountGroup/option?${new URLSearchParams(params).toString()}`,
        }),
    }),
});

export const {
    useGetAccountGroupsQuery,
    useDeleteAccountGroupMutation,
    useCreateAccountGroupMutation,
    useUpdateAccountGroupMutation,
    useGetAccountGroupDetailQuery,
    useGetOptionGroupDetailQuery,
} = accountGroupApi;
