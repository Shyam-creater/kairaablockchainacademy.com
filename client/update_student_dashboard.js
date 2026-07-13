const fs = require('fs');
const path = 'src/components/StudentDashboard.js';
let content = fs.readFileSync(path, 'utf8');

// 1. Add import
if (!content.includes('import WorkspaceProjects')) {
  content = content.replace('import CourseContent from "./Course/CourseContent";', 'import CourseContent from "./Course/CourseContent";\nimport WorkspaceProjects from "./WorkspaceProjects";');
}

// 2. Add to activeTabs sidebar
if (!content.includes("{ id: 'projects', name: 'Projects'")) {
  content = content.replace("{ id: 'ask-doubt', name: 'Ask Doubt', icon: <FiMessageCircle /> },", "{ id: 'ask-doubt', name: 'Ask Doubt', icon: <FiMessageCircle /> },\n          { id: 'projects', name: 'Projects', icon: <FiFolder /> },");
}

// 3. Add to renderWorkspaceContent
if (!content.includes("case 'projects':")) {
  content = content.replace("case 'ask-doubt': return <WorkspaceAskDoubt />;", "case 'ask-doubt': return <WorkspaceAskDoubt />;\n      case 'projects': return <WorkspaceProjects activeCourseId={activeCourseId} user={user} globalCourseName={globalCourseName} />;");
}

fs.writeFileSync(path, content);
console.log('StudentDashboard.js updated');
