import { apiSlice } from '../apiSlice';
import { DepositType } from '@/types/depositType';

export const transactionJournalApi  = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTransactionJournal: builder.query({
            query: (params) => `/Transaction/Journal?${new URLSearchParams(params).toString()}`,
        }),
      
        createTransactionJournal: builder.mutation({
            query: (body: DepositType) => ({
                url: '/Transaction',
                method: 'POST',
                body: body,
            }),
        }),

        deleteTransactionJournal: builder.mutation({
            query: (id: number) => ({
                url: `/Transaction/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useGetTransactionJournalQuery,
    useCreateTransactionJournalMutation,
    useDeleteTransactionJournalMutation,
} = transactionJournalApi ;
