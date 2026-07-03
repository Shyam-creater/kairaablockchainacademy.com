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

// 2. Replace the WorkspaceCertificates function body exactly
const oldFunc = `const WorkspaceCertificates = () => (
    <div className="max-w-6xl mx-auto w-full px-8 py-12">
      <div className="mb-12"><h1 className="text-3xl font-extrabold text-[#111827] mb-2">Certificate Vault</h1></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1,2].map((cert, idx) => (
           <div key={idx} className={\`relative group border rounded-2xl p-4 \${idx === 0 ? 'bg-white border-[#E5E7EB]' : 'bg-[#F9FAFB] border-dashed border-[#D1D5DB] opacity-70 grayscale'}\`}>
              <div className={\`w-full aspect-[4/3] rounded-xl mb-6 relative overflow-hidden \${idx === 0 ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-[#F3F4F6]'} flex flex-col items-center justify-center p-6 text-center shadow-inner\`}>
                 {idx === 0 ? <><div className="absolute top-4 right-4 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"><FiAward className="text-white text-2xl" /></div><h2 className="text-white font-black text-2xl uppercase">Solidity Master</h2></> : <FiAward className="text-[#9CA3AF] text-5xl" />}
              </div>
              <div className="px-2">
                 <h3 className="font-bold text-[#111827] text-lg mb-1">{idx === 0 ? "Solidity Masterclass" : "Web3 Frontend"}</h3>
                 <div className="flex justify-between items-end">
                    <div><p className="text-sm text-[#6B7280]">Issued: Oct 12, 2026</p></div>
                    {idx === 0 && <button className="w-10 h-10 rounded-full bg-[#111827] text-white flex items-center justify-center shadow-md"><FiDownload /></button>}
                 </div>
              </div>
           </div>
        ))}
      </div>
    </div>
  );`;

const newFunc = `const WorkspaceCertificates = () => (
    <div className="w-full h-full bg-[#F8FAFC]">
      <StudentCertificatesPage />
    </div>
  );`;

if (content.includes(oldFunc)) {
    content = content.replace(oldFunc, newFunc);
    fs.writeFileSync(path, content);
    console.log('Successfully replaced WorkspaceCertificates mock data!');
} else {
    console.log('Could not find the exact oldFunc string to replace.');
}
