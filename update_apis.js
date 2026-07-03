const fs = require('fs');

// Update coursesApi.js (Student side)
const coursesApiFile = 'src/redux/features/courses/coursesApi.js';
let coursesContent = fs.readFileSync(coursesApiFile, 'utf8');

const newCoursesEndpoints = `
    // Project endpoints
    getCourseProjectTasks: builder.query({
      query: (courseId) => ({
        url: \`/student/project-tasks/\${courseId}\`,
        method: "GET",
      }),
      providesTags: ["Projects"],
    }),
    getStudentProjects: builder.query({
      query: (courseId) => ({
        url: \`/student/projects/\${courseId}\`,
        method: "GET",
      }),
      providesTags: ["Projects"],
    }),
    submitProject: builder.mutation({
      query: (data) => ({
        url: "/student/projects",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Projects"],
    }),
    studentReplyProject: builder.mutation({
      query: (data) => ({
        url: "/student/projects/reply",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Projects"],
    }),
`;

coursesContent = coursesContent.replace('  }),\n});', newCoursesEndpoints + '  }),\n});');
// Also add "Projects" to tagTypes if not present
if (!coursesContent.includes('"Projects"')) {
  coursesContent = coursesContent.replace('tagTypes: ["Courses", "Doubts", "Assignments"]', 'tagTypes: ["Courses", "Doubts", "Assignments", "Projects"]');
  // Just in case it's formatted differently
  coursesContent = coursesContent.replace('tagTypes: ["Courses", "Doubts", "Assignments", "Meetings"]', 'tagTypes: ["Courses", "Doubts", "Assignments", "Meetings", "Projects"]');
}

fs.writeFileSync(coursesApiFile, coursesContent);

// Update staffApi.js (Staff side)
const staffApiFile = 'src/redux/features/staff/staffApi.js';
let staffContent = fs.readFileSync(staffApiFile, 'utf8');

const newStaffEndpoints = `
    // Project endpoints
    createProjectTask: builder.mutation({
      query: (data) => ({
        url: "/staff/project-task",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Projects"],
    }),
    getStaffProjects: builder.query({
      query: () => ({
        url: "/staff/projects",
        method: "GET",
      }),
      providesTags: ["Projects"],
    }),
    staffReviewProject: builder.mutation({
      query: (data) => ({
        url: "/staff/projects/review",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Projects"],
    }),
`;

staffContent = staffContent.replace('  }),\n});', newStaffEndpoints + '  }),\n});');
if (!staffContent.includes('"Projects"')) {
  staffContent = staffContent.replace('tagTypes: ["Doubts", "Assignments", "Meetings", "Batches"]', 'tagTypes: ["Doubts", "Assignments", "Meetings", "Batches", "Projects"]');
}

fs.writeFileSync(staffApiFile, staffContent);
console.log('RTK APIs updated');
