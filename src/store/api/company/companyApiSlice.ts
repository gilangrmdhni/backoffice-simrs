import { companyType } from '@/types';
import { apiSlice } from '../apiSlice';

export const companyApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCompanies: builder.query({
            query: (params) => `/Company?${new URLSearchParams(params).toString()}`,
        }),
        deleteCompany: builder.mutation({
            query: (id?: number) => {
                return {
                    url: `/Company/${id}`,
                    method: 'DELETE',
                };
            },
        }),
        postCompany: builder.mutation({
            query: (body: companyType) => {
                return {
                    url: 'Company',
                    method: 'POST',
                    body: body,
                };
            },
        }),
        updateCompany: builder.mutation({
            query: (body: companyType) => {
                return {
                    url: 'Company',
                    method: 'PUT',
                    body: body,
                };
            },
        }),
        getDetailCompany: builder.query({
            query: (id?: string) => `/Company/${id}`,
        }),
        exportCompany: builder.mutation({
            query: ({ type, keyword, orderBy, orderType, status }) => ({
                url: `Company/export?type=${type}&keyword=${keyword}&orderBy=${orderBy}&orderType=${orderType}&status=${status}`,
                method: 'GET',
                responseHandler: (response) => response.blob(),
            }),
            transformResponse: (response: Blob) => response,
        }),
    }),
});

export const {
    useGetCompaniesQuery,
    useDeleteCompanyMutation,
    usePostCompanyMutation,
    useUpdateCompanyMutation,
    useGetDetailCompanyQuery,
    useExportCompanyMutation,
} = companyApi;

