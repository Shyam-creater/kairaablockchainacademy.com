import { apiSlice } from "../api/apiSlice";

export const notificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => ({
        url: "/notification/get-all-notifications",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Notifications"],
    }),
    updateNotificationStatus: builder.mutation({
      query: (id) => ({
        url: `/notification/update-notification/${id}`,
        method: "PUT",
        credentials: "include",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const { useGetNotificationsQuery, useUpdateNotificationStatusMutation } = notificationApi;
