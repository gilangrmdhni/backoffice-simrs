import { apiSlice } from '../apiSlice';

export const accountGroupApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAccountGroups: builder.query({
            query: ({ keyword = '', orderBy = 'accountGroupId', orderType = 'asc', page = 1, pageSize = 10 }) =>
                `/AccountGroup?keyword=${keyword}&orderBy=${orderBy}&orderType=${orderType}&page=${page}&pageSize=${pageSize}`,
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
        exportAccountGroup: builder.mutation({
            query: ({ type, keyword, orderBy, orderType }) => ({
                url: `AccountGroup/export?type=${type}&keyword=${keyword}&orderBy=${orderBy}&orderType=${orderType}`,
                method: 'GET',
                responseHandler: (response) => response.blob(),
            }),
            transformResponse: (response: Blob) => response,
        }),
    }),
});

export const {
    useGetAccountGroupsQuery,
    useDeleteAccountGroupMutation,
    useCreateAccountGroupMutation,
    useUpdateAccountGroupMutation,
    useGetAccountGroupDetailQuery,
    useExportAccountGroupMutation,
} = accountGroupApi;
