import { apiSlice } from "../api/apiSlice";

export const galleryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadGalleryImage: builder.mutation({
      query: (data) => ({
        url: "upload-image",
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    deleteGalleryImage: builder.mutation({
      query: (id) => ({
        url: `delete-image/${id}`,
        method: "POST",
        credentials: "include",
      }),
    }),
    getAllGalleryImage: builder.query({
        query: () => ({
          url: "get-all-images",
          method: "GET",
     
          credentials: "include",
        }),
      }),
    editGalleryImage: builder.mutation({
      query: ({ id, data }) => ({
        url: `edit-image/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
    getGalleryAlbums: builder.query({
      query: () => ({
        url: "get-albums",
        method: "GET",
        credentials: "include",
      }),
    }),
    updateGalleryFeatured: builder.mutation({
      query: ({ id, isFeatured }) => ({
        url: `feature-image/${id}`,
        method: "PATCH",
        body: { isFeatured },
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useUploadGalleryImageMutation,
  useGetAllGalleryImageQuery,
  useDeleteGalleryImageMutation,
  useEditGalleryImageMutation,
  useGetGalleryAlbumsQuery,
  useUpdateGalleryFeaturedMutation,
} = galleryApi;