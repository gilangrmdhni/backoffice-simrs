import { COAType } from '@/types';
import { apiSlice } from '../apiSlice';

export const COAApi = apiSlice.injectEndpoints({
    endpoints: (builder :any) => ({
        getCOA: builder.query({
            query: (params : any) => `/COA?${new URLSearchParams(params).toString()}`,
        }),
        deleteCOA: builder.mutation({
            query: (id?: number) => {
                return {
                    url: `/COA/${id}`,
                    method: 'DELETE',
                };
            },
        }),
        postCOA: builder.mutation({
            query: (body: COAType) => {
                return {
                    url: 'COA',
                    method: 'POST',
                    body: body,
                };
            },
        }),
        COAUpload: builder.mutation({
            query: (file:any) => {
                let formData = new FormData();
                formData.append("File", file);
                return {
                    url: 'COA/Upload',
                    method: 'POST',
                    body: formData,
                };
            },
        }),
        downloadCoa: builder.mutation({
            query: () => {
                return {
                    url: `Download/coa-template`,
                    method: 'GET',           
                    responseHandler: (response: any) => response.blob(),
                }
            },
            transformResponse: (response: Blob) => {
                return URL.createObjectURL(response);
            },
        }),
        updateCOA: builder.mutation({
            query: (body: COAType) => {
                return {
                    url: 'COA',
                    method: 'PUT',
                    body: body,
                };
            },
        }),
        getDetailCOA: builder.query({
            query: (id?: string) => `/COA/${id}`,
        }),

        getOptionCOA: builder.query({
            query: (params :any) => `/COA/option?${new URLSearchParams(params).toString()}`,
        }),
    }),
});

export const { useGetCOAQuery, useDownloadCoaMutation,  useDeleteCOAMutation, usePostCOAMutation, useUpdateCOAMutation, useGetDetailCOAQuery,useGetOptionCOAQuery,useCOAUploadMutation } = COAApi;
