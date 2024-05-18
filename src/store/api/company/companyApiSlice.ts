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
    }),
});

export const {
    useGetCompaniesQuery,
    useDeleteCompanyMutation,
    usePostCompanyMutation,
    useUpdateCompanyMutation,
    useGetDetailCompanyQuery
} = companyApi;

