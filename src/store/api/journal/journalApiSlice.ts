import { journalType, usersType } from '@/types';
import { apiSlice } from '../apiSlice';

export const journalRefApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getJournal: builder.query({
            query: (params) => `/Journal?${new URLSearchParams(params).toString()}`,
        }),
        deleteJournal: builder.mutation({
            query: (id?: number) => {
                return {
                    url: `/Transaction/${id}`,
                    method: 'DELETE',
                };
            },
        }),
        postJournal: builder.mutation({
            query: (body: journalType) => {
                return {
                    url: '/Transaction',
                    method: 'POST',
                    body: body,
                };
            },
        }),
        updateJournal: builder.mutation({
            query: (body: usersType) => {
                return {
                    url: '/Journal',
                    method: 'PUT',
                    body: body,
                };
            },
        }),
        getDetailJournal: builder.query({
            query: (id?: string) => `/Transaction/${id}`,
        }),
    }),
});

export const { useGetJournalQuery, useDeleteJournalMutation, usePostJournalMutation, useUpdateJournalMutation, useGetDetailJournalQuery } = journalRefApi;
