const fs = require('fs');
const path = 'server/routes/staff.route.js';
let content = fs.readFileSync(path, 'utf8');

const newImports = `  createProjectTask, getStaffProjects, staffReviewProject,
`;
content = content.replace('getStaffBatches\n} from "../controllers/staff.controller.js";', 'getStaffBatches,\n' + newImports + '} from "../controllers/staff.controller.js";');

const newRoutes = `
// Projects
staffRouter.post("/project-task", isAuthenticated, authorizeRoles("staff"), createProjectTask);
staffRouter.get("/projects", isAuthenticated, authorizeRoles("staff"), getStaffProjects);
staffRouter.put("/projects/review", isAuthenticated, authorizeRoles("staff"), staffReviewProject);

export default staffRouter;`;

content = content.replace('export default staffRouter;', newRoutes);

fs.writeFileSync(path, content);
console.log('staff.route.js updated');
