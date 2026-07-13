const fs = require('fs');
const path = 'server/routes/student.route.js';
let content = fs.readFileSync(path, 'utf8');

const newImports = `  submitProject,
  getStudentProjects,
  getCourseProjectTasks,
  studentReplyProject,
`;
content = content.replace('  getCourseAssignmentTasks,', '  getCourseAssignmentTasks,\n' + newImports);

const newRoutes = `// Projects
studentRouter.post("/projects", isAuthenticated, submitProject);
studentRouter.get("/projects/:courseId", isAuthenticated, getStudentProjects);
studentRouter.get("/project-tasks/:courseId", isAuthenticated, getCourseProjectTasks);
studentRouter.put("/projects/reply", isAuthenticated, studentReplyProject);

export default studentRouter;`;

content = content.replace('export default studentRouter;', newRoutes);

fs.writeFileSync(path, content);
console.log('student.route.js updated');
