const fs = require('fs');

// 1. Restore Project Endpoints to coursesApi.js
const coursesApiFile = 'src/redux/features/courses/coursesApi.js';
let coursesContent = fs.readFileSync(coursesApiFile, 'utf8');

if (!coursesContent.includes('getCourseProjectTasks')) {
  const newCoursesEndpoints = `
    // Project endpoints
    getCourseProjectTasks: builder.query({
      query: (courseId) => ({
        url: \`/student/project-tasks/\${courseId}\`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Projects"],
    }),
    getStudentProjects: builder.query({
      query: (courseId) => ({
        url: \`/student/projects/\${courseId}\`,
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
`;
  coursesContent = coursesContent.replace('  }),\n});', newCoursesEndpoints + '  }),\n});');
  coursesContent = coursesContent.replace('tagTypes: ["Courses", "Doubts", "Assignments", "Meetings"]', 'tagTypes: ["Courses", "Doubts", "Assignments", "Meetings", "Projects"]');
  
  // Add exports
  const courseExports = `  useGetCourseProjectTasksQuery,
  useGetStudentProjectsQuery,
  useSubmitProjectMutation,
  useStudentReplyProjectMutation,
} = courseApi;`;
  coursesContent = coursesContent.replace('} = courseApi;', courseExports);
  fs.writeFileSync(coursesApiFile, coursesContent);
}

// 2. Add credentials: "include" to staffApi.js (it was not reverted by git checkout unless I checked it out too)
const staffApiFile = 'src/redux/features/staff/staffApi.js';
let staffContent = fs.readFileSync(staffApiFile, 'utf8');

if (staffContent.includes('url: "/staff/projects"')) {
  staffContent = staffContent.replace(
    'url: "/staff/project-task",\n        method: "POST",\n        body: data,\n      }),',
    'url: "/staff/project-task",\n        method: "POST",\n        body: data,\n        credentials: "include",\n      }),'
  );
  staffContent = staffContent.replace(
    'url: "/staff/projects",\n        method: "GET",\n      }),',
    'url: "/staff/projects",\n        method: "GET",\n        credentials: "include",\n      }),'
  );
  staffContent = staffContent.replace(
    'url: "/staff/projects/review",\n        method: "PUT",\n        body: data,\n      }),',
    'url: "/staff/projects/review",\n        method: "PUT",\n        body: data,\n        credentials: "include",\n      }),'
  );
  fs.writeFileSync(staffApiFile, staffContent);
}

console.log('Fixed API credentials and endpoints');
