import { apiSlice } from "../api/apiSlice";

export const blogApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllBlogs: builder.query({
      query: () => ({
        url: "get-all-blogs",
        method: "GET",
        credentials: "include",
      }),
    }),
    createBlog: builder.mutation({
      query: (data) => ({
        url: "create-blog",
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    editBlog: builder.mutation({
      query: ({ id, data }) => ({
        url: `edit-blog/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `delete-blog/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
    getBlogAnalytics: builder.query({
      query: () => ({
        url: "blog-analytics",
        method: "GET",
        credentials: "include",
      }),
    }),
    updateBlogStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `blog-status/${id}`,
        method: "PATCH",
        body: { status },
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useGetAllBlogsQuery,
  useCreateBlogMutation,
  useEditBlogMutation,
  useDeleteBlogMutation,
  useGetBlogAnalyticsQuery,
  useUpdateBlogStatusMutation,
} = blogApi;
