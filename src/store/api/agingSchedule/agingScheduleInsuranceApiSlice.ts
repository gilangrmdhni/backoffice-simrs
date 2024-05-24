import { apiSlice } from '../apiSlice';

export const agingScheduleInsuranceApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAgingScheduleInsurance: builder.query({
            query: (params) => `/Receivable/agingschedule/insurance?${new URLSearchParams(params).toString()}`,
        }),
        getAgingScheduleInsuranceData: builder.mutation({
            query: (params) => `/Receivable/agingschedule/insurance?${new URLSearchParams(params).toString()}`,
        }),
    }),
});

export const {
    useGetAgingScheduleInsuranceQuery,
    useGetAgingScheduleInsuranceDataMutation
} = agingScheduleInsuranceApi;
