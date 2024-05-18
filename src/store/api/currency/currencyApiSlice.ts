import { CurrencyType } from '@/types';
import { apiSlice } from '../apiSlice';

export const currencyApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCurrency: builder.query({
            query: (params) => `/Currency?${new URLSearchParams(params).toString()}`,
        }),
        deleteCurrency: builder.mutation({
            query: (id?: number) => {
                return {
                    url: `/Currency/${id}`,
                    method: 'DELETE',
                };
            },
        }),
        postCurrency: builder.mutation({
            query: (body: CurrencyType) => {
                return {
                    url: 'Currency',
                    method: 'POST',
                    body: body,
                };
            },
        }),
        updateCurrency: builder.mutation({
            query: (body: CurrencyType) => {
                return {
                    url: 'Currency',
                    method: 'PUT',
                    body: body,
                };
            },
        }),
        getDetailCurrency: builder.query({
            query: (id?: string) => `/Currency/${id}`,
        }),
    }),
});

export const {
    useGetCurrencyQuery,
    useDeleteCurrencyMutation,
    usePostCurrencyMutation,
    useUpdateCurrencyMutation,
    useGetDetailCurrencyQuery
} = currencyApi;
