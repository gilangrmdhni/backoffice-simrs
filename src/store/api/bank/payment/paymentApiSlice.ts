import { apiSlice } from '../../apiSlice';
import { PaymentType, PaymentUpdateType } from '@/types/paymentType';

export const paymentApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPayments: builder.query({
            query: (params) => `/Bank/payment?${new URLSearchParams(params).toString()}`,
        }),
        getPaymentDetail: builder.query({
            query: (id: number) => `/Bank/payment/${id}`,
        }),
        createPayment: builder.mutation({
            query: (data: PaymentType) => ({
                url: '/Transaction',
                method: 'POST',
                body: data,
            }),
        }),
        updatePayment: builder.mutation({
            query: (data: PaymentUpdateType) => ({
                url: `/Bank/payment/${data.journalId}`,
                method: 'PUT',
                body: data,
            }),
        }),
        deletePayment: builder.mutation({
            query: (id: number) => ({
                url: `/Bank/payment/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useGetPaymentsQuery,
    useGetPaymentDetailQuery,
    useCreatePaymentMutation,
    useUpdatePaymentMutation,
    useDeletePaymentMutation,
} = paymentApi;
