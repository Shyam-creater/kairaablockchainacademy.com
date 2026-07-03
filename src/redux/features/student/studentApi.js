import { apiSlice } from "../api/apiSlice";

export const studentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStudentDashboardMetrics: builder.query({
      query: () => ({
        url: "/student/dashboard-metrics",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["StudentMetrics"],
    }),
  }),
});

export const { useGetStudentDashboardMetricsQuery } = studentApi;
