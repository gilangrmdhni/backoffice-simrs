import { ReconciliationType, ReconciliationUpdateType } from '@/types/reconcileType';
import { apiSlice } from '../../apiSlice';

export const reconciliationApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getReconciliations: builder.query({
            query: (params) => `/Bank/reconciliation?${new URLSearchParams(params).toString()}`,
        }),
        getReconciliationDetail: builder.query({
            query: (id: number) => `/Bank/reconciliation/${id}`,
        }),
        createReconciliation: builder.mutation({
            query: (data: ReconciliationType) => ({
                url: '/Bank/reconciliation',
                method: 'POST',
                body: data,
            }),
        }),
        updateReconciliation: builder.mutation({
            query: (data: ReconciliationUpdateType) => ({
                url: `/Bank/reconciliation/${data.id}`,
                method: 'PUT',
                body: data,
            }),
        }),
        deleteReconciliation: builder.mutation({
            query: (id: number) => ({
                url: `/Bank/reconciliation/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useGetReconciliationsQuery,
    useGetReconciliationDetailQuery,
    useCreateReconciliationMutation,
    useUpdateReconciliationMutation,
    useDeleteReconciliationMutation,
} = reconciliationApi;
