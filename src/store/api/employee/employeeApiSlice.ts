import { apiSlice } from '../apiSlice';

export const employeeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEmployee: builder.query({
      query: (params) => `/TrainingHistory?${new URLSearchParams(params).toString()}`,
    }),
  }),
});

export const { useGetEmployeeQuery } = employeeApi;
