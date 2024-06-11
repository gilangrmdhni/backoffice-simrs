import { apiSlice } from '../../apiSlice';
import { BookBankType } from '@/types/bookBankType';

export const bookBankApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getBookBanks: builder.query({
            query: ({ orderBy = 'createdDate', orderType = 'desc', page = 1, pageSize = 10 }) =>
                `/Transaction?orderBy=${orderBy}&orderType=${orderType}&page=${page}&pageSize=${pageSize}`,
        }),
        deleteBookBank: builder.mutation({
            query: (id: number) => ({
                url: `/Transaction/${id}`,
                method: 'DELETE',
            }),
        }),
        createBookBank: builder.mutation({
            query: (body: BookBankType) => ({
                url: '/Transaction',
                method: 'POST',
                body: body,
            }),
        }),
        updateBookBank: builder.mutation({
            query: (body: BookBankType) => ({
                url: '/Transaction',
                method: 'PUT',
                body: body,
            }),
        }),
        getBookBankDetail: builder.query({
            query: (id: number) => `/Bank/book/${id}`,
        }),
    }),
});

export const {
    useGetBookBanksQuery,
    useDeleteBookBankMutation,
    useCreateBookBankMutation,
    useUpdateBookBankMutation,
    useGetBookBankDetailQuery,
} = bookBankApi;
