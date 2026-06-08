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
  }),
});


export const {useUploadGalleryImageMutation,useGetAllGalleryImageQuery,useDeleteGalleryImageMutation}=galleryApi;