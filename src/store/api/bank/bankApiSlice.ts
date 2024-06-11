import { apiSlice } from '../apiSlice';
import { BankType } from '@/types/bankType';

interface GetBanksQueryParams {
    orderBy?: string;
    orderType?: string;
    page?: number;
    pageSize?: number;
}

export const bankApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getBanks: builder.query<{ data: BankType[] }, GetBanksQueryParams>({
            query: ({ orderBy = 'coacode', orderType = 'asc', page = 1, pageSize = 10 } = {}) =>
                `/Bank?orderBy=${orderBy}&orderType=${orderType}&page=${page}&pageSize=${pageSize}`,
        }),
        getOptionBank: builder.query({
            query: (params) => `/coa/option?${new URLSearchParams(params).toString()}`,
        }),
    }),
});

export const { useGetBanksQuery,useGetOptionBankQuery } = bankApi;
