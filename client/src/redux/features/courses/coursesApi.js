import { apiSlice } from "../api/apiSlice";

export const courseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    getPublicProjects: builder.query({
      query: () => ({
        url: "get-public-projects",
        method: "GET",
      }),
    }),

    createCourse: builder.mutation({
      query: (data) => ({
        url: "create-course",
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    getAllCourses: builder.query({
      query: () => ({
        url: "get-admin-courses",
        method: "GET",
        credentials: "include",
      }),
    }),
    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `delete-course/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
    editCourse: builder.mutation({
      query: ({ id, data }) => ({
        url: `edit-course/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
    getUserAllCourses: builder.query({
      query: () => ({
        url: `get-all-courses`,
        method: "GET",
        credentials: "include",
      }),
    }),
    getCourseDetails: builder.query({
      query: (id) => ({
        url: `get-course/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    getCourseContent: builder.query({
      query: (id) => ({
        url: `get-course-content/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    addNewQuestion: builder.mutation({
      query: ({question, courseId,contentId}) => ({
        url: `add-question`,
        method: "PUT",
        body: {
          question,
          courseId,
          contentId,
        },
        credentials: "include",
      }),
    }),
    addAnswerInQuestion:builder.mutation({
      query:({answer,questionId, courseId,contentId})=>({
        url:"add-answer",
        method:"PUT",
        body:{
          answer,questionId, courseId,contentId
        },
        credentials:"include"
      })
    }),

    // Progress
    getCourseProgress: builder.query({
      query: (courseId) => ({
        url: `progress/${courseId}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    
    // Resume Learning
    getResumeProgress: builder.query({
      query: (courseId) => ({
        url: `progress/${courseId}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    saveResumeProgress: builder.mutation({
      query: (data) => ({
        url: `progress/save`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    markLessonWatched: builder.mutation({
      query: ({ courseId, lessonId }) => ({
        url: "progress/mark",
        method: "POST",
        body: { courseId, lessonId },
        credentials: "include",
      }),
    }),

    // Quiz
    getQuizForSection: builder.query({
      query: ({ courseId, sectionName }) => ({
        url: `quiz/${courseId}/${encodeURIComponent(sectionName)}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    getStudentQuizzes: builder.query({
      query: (courseId) => ({
        url: `quiz/student/${courseId}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    submitQuiz: builder.mutation({
      query: ({ quizId, answers }) => ({
        url: "quiz/submit",
        method: "POST",
        body: { quizId, answers },
        credentials: "include",
      }),
    }),

    // Certificate
    generateCertificate: builder.mutation({
      query: (courseId) => ({
        url: "certificate/generate",
        method: "POST",
        body: { courseId },
        credentials: "include",
      }),
    }),
    getMyCertificates: builder.query({
      query: () => ({
        url: "certificates/me",
        method: "GET",
        credentials: "include",
      }),
    }),
    verifyCertificate: builder.query({
      query: (uuid) => ({
        url: `certificate/verify/${uuid}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    getCertificateRecommendations: builder.query({
      query: () => ({
        url: "certificate/recommendations",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Recommendations"],
    }),
    approveCertificate: builder.mutation({
      query: (data) => ({
        url: "certificate/approve",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Recommendations"],
    }),
    
    // STUDENT DOUBTS
    createDoubt: builder.mutation({
      query: (data) => ({
        url: "student/doubts",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Doubts"],
    }),
    getStudentDoubts: builder.query({
      query: (courseId) => ({
        url: `student/doubts/${courseId}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Doubts"],
    }),
    studentReplyDoubt: builder.mutation({
      query: (data) => ({
        url: "student/doubts/reply",
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Doubts"],
    }),
    
    // STUDENT ASSIGNMENTS
    submitAssignment: builder.mutation({
      query: (data) => ({
        url: "student/assignments",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Assignments"],
    }),
    getStudentAssignments: builder.query({
      query: (courseId) => ({
        url: `student/assignments/${courseId}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Assignments"],
    }),
    getCourseAssignmentTasks: builder.query({
      query: (courseId) => ({
        url: `student/assignment-tasks/${courseId}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["AssignmentTasks"],
    }),

    // STUDENT MEETINGS
    getStudentMeetings: builder.query({
      query: (courseId) => ({
        url: `student/meetings/${courseId}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Meetings"],
    }),
    markAttendance: builder.mutation({
      query: (data) => ({
        url: "student/attendance/mark",
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
  
    // Project endpoints
    getCourseProjectTasks: builder.query({
      query: (courseId) => ({
        url: `/student/project-tasks/${courseId}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Projects"],
    }),
    getStudentProjects: builder.query({
      query: (courseId) => ({
        url: `/student/projects/${courseId}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Projects"],
    }),
    submitProject: builder.mutation({
      query: (data) => ({
        url: "/student/projects",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Projects"],
    }),
    studentReplyProject: builder.mutation({
      query: (data) => ({
        url: "/student/projects/reply",
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Projects"],
    }),
  }),
});

export const { useGetPublicProjectsQuery,
  useCreateCourseMutation,
  useGetUserAllCoursesQuery,
  useGetAllCoursesQuery,
  useDeleteCourseMutation,
  useEditCourseMutation,
  useGetCourseDetailsQuery,
  useGetCourseContentQuery,
  useAddNewQuestionMutation,
  useAddAnswerInQuestionMutation,
  useGetCourseProgressQuery,
  useGetResumeProgressQuery,
  useSaveResumeProgressMutation,
  useMarkLessonWatchedMutation,
  useGetQuizForSectionQuery,
  useGetStudentQuizzesQuery,
  useSubmitQuizMutation,
  useGenerateCertificateMutation,
  useGetMyCertificatesQuery,
  useVerifyCertificateQuery,
  useGetCertificateRecommendationsQuery,
  useApproveCertificateMutation,
  useCreateDoubtMutation,
  useGetStudentDoubtsQuery,
  useStudentReplyDoubtMutation,
  useSubmitAssignmentMutation,
  useGetStudentAssignmentsQuery,
  useGetCourseAssignmentTasksQuery,
  useGetStudentMeetingsQuery,
  useMarkAttendanceMutation,
  useGetCourseProjectTasksQuery,
  useGetStudentProjectsQuery,
  useSubmitProjectMutation,
  useStudentReplyProjectMutation,
} = courseApi;
