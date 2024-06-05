import { apiSlice } from '../apiSlice';

export const receivableApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getOptionInsurance: builder.query({
            query: (params) => `/Receivable/insurance?${new URLSearchParams(params).toString()}`,
        }),
        getOptionStatus: builder.query({
            query: (params) => `/Receivable/due-status?${new URLSearchParams(params).toString()}`,
        }),
    }),
});

export const {
    useGetOptionInsuranceQuery,
    useGetOptionStatusQuery,
} = receivableApi;
