import { apiSlice } from "../api/apiSlice";

export const staffApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAssignedStudents: builder.query({
      query: () => ({
        url: "staff/assigned-students",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["AssignedStudents"],
    }),
    getStaffAssignedCourses: builder.query({
      query: () => ({
        url: "staff/assigned-courses",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["AssignedCourses"],
    }),
    scheduleMeeting: builder.mutation({
      query: (data) => ({
        url: "staff/meetings",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Meetings"],
    }),
    getMeetings: builder.query({
      query: () => ({
        url: "staff/meetings",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Meetings"],
    }),
    uploadMeetingRecording: builder.mutation({
      query: (data) => ({
        url: "staff/meetings/upload-recording",
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Meetings"],
    }),
    getStaffDoubts: builder.query({
      query: () => ({
        url: "staff/doubts",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Doubts"],
    }),
    replyToDoubt: builder.mutation({
      query: (data) => ({
        url: "staff/doubts/reply",
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Doubts"],
    }),
    resolveDoubt: builder.mutation({
      query: (doubtId) => ({
        url: `staff/doubts/${doubtId}/resolve`,
        method: "PUT",
        credentials: "include",
      }),
      invalidatesTags: ["Doubts"],
    }),
    getStaffAssignments: builder.query({
      query: () => ({
        url: "staff/assignments",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Assignments"],
    }),
    reviewAssignment: builder.mutation({
      query: (data) => ({
        url: "staff/assignments/review",
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Assignments"],
    }),
    getStudentsProgress: builder.query({
      query: () => ({
        url: "staff/students-progress",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["StudentsProgress"],
    }),
    recommendCertificate: builder.mutation({
      query: (data) => ({
        url: "staff/recommend-certificate",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["StudentsProgress"],
    }),
    getCourseQuizzes: builder.query({
      query: (courseId) => ({
        url: `quiz/course/${courseId}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Quizzes"],
    }),
    createOrUpdateQuiz: builder.mutation({
      query: (data) => ({
        url: "quiz/admin/create",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Quizzes"],
    }),
    getQuizAnalytics: builder.query({
      query: () => ({
        url: "quiz/admin/analytics",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Quizzes", "QuizAttempts"],
    }),
    getQuizLeaderboard: builder.query({
      query: (courseId) => ({
        url: `quiz/admin/leaderboard${courseId ? `?courseId=${courseId}` : ''}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Quizzes", "QuizAttempts"],
    }),
    getStudentResults: builder.query({
      query: (courseId) => ({
        url: `quiz/admin/results${courseId ? `?courseId=${courseId}` : ''}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Quizzes", "QuizAttempts"],
    }),
    createAssignmentTask: builder.mutation({
      query: (data) => ({
        url: "staff/assignment-task",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["AssignmentTasks"],
    }),
    getStaffAssignmentTasks: builder.query({
      query: () => ({
        url: "staff/assignment-task",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["AssignmentTasks"],
    }),
    getAttendanceDashboard: builder.query({
      query: () => ({
        url: "staff/attendance-dashboard",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Attendance"],
    }),
    sendAttendanceReminder: builder.mutation({
      query: (data) => ({
        url: "staff/attendance-reminder",
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    getStaffBatches: builder.query({
      query: () => ({
        url: "staff/batches",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Batches"],
    }),

    // All sessions (history) — filterable by courseId query param
    getAllSessions: builder.query({
      query: (courseId) => ({
        url: courseId ? `staff/all-sessions?courseId=${courseId}` : "staff/all-sessions",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Attendance"],
    }),

    // Per-student attendance stats
    getStudentAttendanceStats: builder.query({
      query: () => ({
        url: "staff/student-attendance-stats",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Attendance"],
    }),

    // Manual attendance mark by staff
    markAttendanceManually: builder.mutation({
      query: (data) => ({
        url: "staff/mark-attendance",
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Attendance"],
    }),

    // Project endpoints
    createProjectTask: builder.mutation({
      query: (data) => ({
        url: "/staff/project-task",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Projects"],
    }),
    getStaffProjects: builder.query({
      query: () => ({
        url: "/staff/projects",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Projects"],
    }),
    staffReviewProject: builder.mutation({
      query: (data) => ({
        url: "/staff/projects/review",
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Projects"],
    }),
  }),
});

export const {
  useGetAssignedStudentsQuery,
  useGetStaffAssignedCoursesQuery,
  useScheduleMeetingMutation,
  useGetMeetingsQuery,
  useUploadMeetingRecordingMutation,
  useGetStaffDoubtsQuery,
  useReplyToDoubtMutation,
  useResolveDoubtMutation,
  useGetStaffAssignmentsQuery,
  useReviewAssignmentMutation,
  useGetStudentsProgressQuery,
  useRecommendCertificateMutation,
  useGetCourseQuizzesQuery,
  useCreateOrUpdateQuizMutation,
  useGetQuizAnalyticsQuery,
  useGetQuizLeaderboardQuery,
  useGetStudentResultsQuery,
  useCreateAssignmentTaskMutation,
  useGetStaffAssignmentTasksQuery,
  useGetAttendanceDashboardQuery,
  useSendAttendanceReminderMutation,
  useGetStaffBatchesQuery,
  useGetAllSessionsQuery,
  useGetStudentAttendanceStatsQuery,
  useMarkAttendanceManuallyMutation,
  useCreateProjectTaskMutation,
  useGetStaffProjectsQuery,
  useStaffReviewProjectMutation,
} = staffApi;
