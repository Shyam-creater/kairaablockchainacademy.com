const fs = require('fs');
const path = 'c:\\Users\\Admin\\OneDrive\\Desktop\\academy\\academy\\academy\\src\\components\\StudentDashboard.js';
let content = fs.readFileSync(path, 'utf8');

// 1. Add import
if (!content.includes('import StudentCertificatesPage from')) {
    content = content.replace(
        'import CourseContent from "./Course/CourseContent";', 
        'import CourseContent from "./Course/CourseContent";\nimport StudentCertificatesPage from "../pages/Student/StudentCertificatesPage";'
    );
}

// 2. Regex replace the WorkspaceCertificates mock
const oldContent = content;
content = content.replace(
    /const WorkspaceCertificates = \(\) => \([\s\S]*?Certificate Vault[\s\S]*?\n  \);/,
    `const WorkspaceCertificates = () => (
    <div className="w-full h-full bg-[#F8FAFC]">
      <StudentCertificatesPage />
    </div>
  );`
);

if (content !== oldContent) {
    fs.writeFileSync(path, content);
    console.log('Successfully replaced WorkspaceCertificates mock data!');
} else {
    console.log('Could not find the function using regex.');
}
