import { apiSlice } from "../api/apiSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateAvatar: builder.mutation({
      query: (avatar) => ({
        url: "update-user-avatar",
        method: "PUT",
        body: { avatar },
        credentials: "include",
      }),
    }),
    editProfile: builder.mutation({
      query: ({ name }) => ({
        url: "update-user-info",
        method: "PUT",
        body: { name },
        credentials: "include",
      }),
    }),
    updatePassword: builder.mutation({
      query: ({ oldPassword, newPassword }) => ({
        url: "update-user-password",
        method: "PUT",
        body: {
          oldPassword,
          newPassword,
        },
        credentials: "include",
      }),
    }),
    getAllUsers: builder.query({
      query: () => ({
        url: "get-all-users",
        method: "GET",
        credentials: "include",
      }),
    }),
    updateUserRole: builder.mutation({
        query: ({email,role}) => ({
          url: "update-user-role",
          method: "PUT",
          body:{email,role},
          credentials: "include",
        }),
      }),
      deleteUser: builder.mutation({
        query: (id) => ({
          url: `delete-user/${id}`,
          method: "DELETE",
          credentials: "include",
        }),
      }),
      registerCourse: builder.mutation({
        query: (formData) => ({
          url: "register-course",
          method: "POST",
          body: formData,
          // credentials: "include",
        }),
      }),
      getAllRegistrations: builder.query({
        query: () => ({
          url: "get-all-registrations",
          method: "GET",
          credentials: "include",
        }),
      }),
      toggleFavorite: builder.mutation({
        query: (courseId) => ({
          url: "toggle-favorite",
          method: "PUT",
          body: { courseId },
          credentials: "include",
        }),
      }),
  }),
});

export const {
  useUpdateAvatarMutation,
  useEditProfileMutation,
  useUpdatePasswordMutation,
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
  useRegisterCourseMutation,
  useGetAllRegistrationsQuery,
  useToggleFavoriteMutation
} = userApi;
