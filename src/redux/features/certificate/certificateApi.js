import { apiSlice } from "../api/apiSlice";

export const certificateApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Student Routes
    getStudentProgress: builder.query({
      query: () => ({
        url: "/certificate/student/progress",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Certificates"],
    }),
    getStudentCertificates: builder.query({
      query: () => ({
        url: "/certificate/student",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Certificates"],
    }),

    // Staff Routes
    getStaffEligibleStudents: builder.query({
      query: () => ({
        url: "/certificate/staff/eligible",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Certificates"],
    }),
    getStaffCertificates: builder.query({
      query: () => ({
        url: "/certificate/staff",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Certificates"],
    }),
    recommendCertificate: builder.mutation({
      query: (data) => ({
        url: `/certificate/staff-recommend`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Certificates"],
    }),
    
    // Shared Staff/Admin Rejection/Return
    rejectCertificate: builder.mutation({
      query: ({ id, remarks, status }) => ({
        url: `/certificate/reject/${id}`,
        method: "PUT",
        body: { remarks, status },
        credentials: "include",
      }),
      invalidatesTags: ["Certificates"],
    }),

    // Admin Routes
    getAdminCertificates: builder.query({
      query: () => ({
        url: "/certificate/admin",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Certificates"],
    }),
    adminApproveCertificate: builder.mutation({
      query: (id) => ({
        url: `/certificate/admin-approve/${id}`,
        method: "PUT",
        credentials: "include",
      }),
      invalidatesTags: ["Certificates"],
    }),
    revokeCertificate: builder.mutation({
      query: (id) => ({
        url: `/certificate/revoke/${id}`,
        method: "PUT",
        credentials: "include",
      }),
      invalidatesTags: ["Certificates"],
    }),
    getCertificateAnalytics: builder.query({
      query: () => ({
        url: "/certificate/analytics",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Certificates"],
    }),

    // Public Verification
    verifyCertificatePublic: builder.query({
      query: (certificateNumber) => `/certificate/verify/${certificateNumber}`,
    }),
  }),
});

export const {
  useGetStudentProgressQuery,
  useGetStudentCertificatesQuery,
  useGetStaffEligibleStudentsQuery,
  useGetStaffCertificatesQuery,
  useRecommendCertificateMutation,
  useRejectCertificateMutation,
  useGetAdminCertificatesQuery,
  useAdminApproveCertificateMutation,
  useRevokeCertificateMutation,
  useGetCertificateAnalyticsQuery,
  useVerifyCertificatePublicQuery,
} = certificateApi;
