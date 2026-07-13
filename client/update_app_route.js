const fs = require('fs');

// 1. Update App.js
const appPath = 'src/App.js';
let appContent = fs.readFileSync(appPath, 'utf8');

if (!appContent.includes('StaffProjectsPage')) {
  appContent = appContent.replace(
    'import StaffAssignmentsPage from "./pages/Staff/StaffAssignmentsPage";',
    'import StaffAssignmentsPage from "./pages/Staff/StaffAssignmentsPage";\nimport StaffProjectsPage from "./pages/Staff/StaffProjectsPage";'
  );
  
  appContent = appContent.replace(
    '<Route path="assignments" element={<StaffAssignmentsPage />} />',
    '<Route path="assignments" element={<StaffAssignmentsPage />} />\n                <Route path="projects" element={<StaffProjectsPage />} />'
  );
  
  fs.writeFileSync(appPath, appContent);
  console.log('App.js updated');
}

// 2. Update AdminLayout.js
const layoutPath = 'src/components/Admin/AdminLayout.js';
let layoutContent = fs.readFileSync(layoutPath, 'utf8');

if (!layoutContent.includes('/staff/projects')) {
  // In AdminLayout, there is a list of staff links. We need to find the staff links array.
  // Actually, wait, let me check how AdminLayout does links.
}
