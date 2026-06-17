import { apiSlice } from "../api/apiSlice";

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Dashboard KPIs
    getDashboardSummary: builder.query({
      query: () => ({
        url: "admin/dashboard/summary",
        method: "GET",
        credentials: "include",
      }),
    }),

    // Trends time-series
    getDashboardTrends: builder.query({
      query: (days = 30) => ({
        url: `admin/dashboard/trends?days=${days}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    // Paginated users (admin view)
    getAdminUsers: builder.query({
      query: ({ page = 1, limit = 10, search = "", role = "", suspended = "" } = {}) => ({
        url: `admin/users/paginated?page=${page}&limit=${limit}&search=${search}&role=${role}&suspended=${suspended}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["AdminUsers"],
    }),

    // Suspend / Reactivate user
    suspendUser: builder.mutation({
      query: (userId) => ({
        url: `admin/users/${userId}/suspend`,
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["AdminUsers"],
    }),

    // Orders summary analytics
    getAdminOrdersSummary: builder.query({
      query: () => ({
        url: "admin/orders/summary",
        method: "GET",
        credentials: "include",
      }),
    }),

    // Paginated orders
    getAdminOrders: builder.query({
      query: ({ page = 1, limit = 15 } = {}) => ({
        url: `admin/orders?page=${page}&limit=${limit}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    // Audit logs
    getAuditLogs: builder.query({
      query: ({ page = 1, limit = 20, action = "" } = {}) => ({
        url: `admin/audit-logs?page=${page}&limit=${limit}&action=${action}`,
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useGetDashboardSummaryQuery,
  useGetDashboardTrendsQuery,
  useGetAdminUsersQuery,
  useSuspendUserMutation,
  useGetAdminOrdersSummaryQuery,
  useGetAdminOrdersQuery,
  useGetAuditLogsQuery,
} = adminApi;
