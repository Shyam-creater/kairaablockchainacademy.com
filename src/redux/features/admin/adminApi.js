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

    // CRM 360 Profile
    getUserProfile360: builder.query({
      query: (userId) => ({
        url: `admin/users/${userId}/profile`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["UserProfile360"],
    }),

    // Bulk Actions
    bulkActionUsers: builder.mutation({
      query: (data) => ({
        url: "admin/users/bulk-action",
        method: "POST",
        body: data,
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

    // Assign Staff
    assignStaff: builder.mutation({
      query: ({ id, type, staffId }) => ({
        url: `admin/assign-staff`,
        method: "POST",
        body: { id, type, staffId },
        credentials: "include",
      }),
    }),

    // Batches
    createBatch: builder.mutation({
      query: (data) => ({
        url: `admin/batches`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Batches"],
    }),
    getAllBatches: builder.query({
      query: () => ({
        url: `admin/batches`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Batches"],
    }),
    addStudentToBatch: builder.mutation({
      query: ({ batchId, studentId }) => ({
        url: `admin/batches/${batchId}/students`,
        method: "PUT",
        body: { studentId },
        credentials: "include",
      }),
      invalidatesTags: ["Batches"],
    }),

    // Notifications
    getNotifications: builder.query({
      query: () => ({
        url: `get-all-notifications`,
        method: "GET",
        credentials: "include",
      }),
    }),
    updateNotification: builder.mutation({
      query: (id) => ({
        url: `update-notification/${id}`,
        method: "PUT",
        credentials: "include",
      }),
    }),

    // Staff Metrics & 360 Profile
    getStaffMetrics: builder.query({
      query: () => ({
        url: `admin/staff/metrics`,
        method: "GET",
        credentials: "include",
      }),
    }),
    getStaffProfile360: builder.query({
      query: (id) => ({
        url: `admin/staff/${id}/profile360`,
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
  useAssignStaffMutation,
  useCreateBatchMutation,
  useGetAllBatchesQuery,
  useAddStudentToBatchMutation,
  useGetNotificationsQuery,
  useUpdateNotificationMutation,
  useGetUserProfile360Query,
  useBulkActionUsersMutation,
  useGetStaffMetricsQuery,
  useGetStaffProfile360Query
} = adminApi;
