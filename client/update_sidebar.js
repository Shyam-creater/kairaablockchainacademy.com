const fs = require('fs');

const path = 'src/components/Admin/AdminSidebar.js';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('FiFolder')) {
  content = content.replace(/import {([^}]+)} from "react-icons\/fi";/, 'import { $1, FiFolder } from "react-icons/fi";');
}

if (!content.includes('title="Projects"')) {
  content = content.replace(
    '<NavItem title="Assignments" to="/staff/assignments" icon={FiCheckSquare} isCollapsed={activeCollapsed} />',
    '<NavItem title="Assignments" to="/staff/assignments" icon={FiCheckSquare} isCollapsed={activeCollapsed} />\n              <NavItem title="Projects" to="/staff/projects" icon={FiFolder} isCollapsed={activeCollapsed} />'
  );
}

fs.writeFileSync(path, content);
console.log('AdminSidebar.js updated');
