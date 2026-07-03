const fs = require('fs');

const filePaths = {
  staff: 'c:/Users/Admin/OneDrive/Desktop/academy/academy/academy/server/controllers/staff.controller.js',
  quiz: 'c:/Users/Admin/OneDrive/Desktop/academy/academy/academy/server/controllers/quiz.controller.js',
  certificate: 'c:/Users/Admin/OneDrive/Desktop/academy/academy/academy/server/controllers/certificate.controller.js'
};

// 1. Staff Controller
let staff = fs.readFileSync(filePaths.staff, 'utf-8');

staff = staff.replace(
  /const orders = await Order\.find\({ assignedStaffId: staffId, courseId }\)\.populate\("userId", "name email"\);\s+targetStudents = orders\.map\(o => o\.userId\)\.filter\(u => u != null\);/g,
  `const { getAuthorizedStaffStudents } = await import("../utils/staffAccess.js");
      const studentIds = await getAuthorizedStaffStudents(staffId, courseId);
      targetStudents = await User.find({ _id: { $in: studentIds } }).select("name email");`
);

fs.writeFileSync(filePaths.staff, staff);

// 2. Quiz Controller
let quiz = fs.readFileSync(filePaths.quiz, 'utf-8');

quiz = quiz.replace(
  /const orders = await Order\.find\({ assignedStaffId: staffId }\)\.lean\(\);\s+const assignedStudentIds = orders\.map\(o => o\.userId\)\.filter\(Boolean\);/g,
  `const { getAuthorizedStaffStudents } = await import("../utils/staffAccess.js");
      const assignedStudentIds = await getAuthorizedStaffStudents(staffId);`
);

quiz = quiz.replace(
  /const orders = await Order\.find\({ assignedStaffId: req\.user\._id }\)\.lean\(\);\s+const assignedStudentIds = orders\.map\(o => o\.userId\)\.filter\(Boolean\);/g,
  `const { getAuthorizedStaffStudents } = await import("../utils/staffAccess.js");
      const assignedStudentIds = await getAuthorizedStaffStudents(req.user._id);`
);

fs.writeFileSync(filePaths.quiz, quiz);

// 3. Certificate Controller
let cert = fs.readFileSync(filePaths.certificate, 'utf-8');

cert = cert.replace(
  /const orders = await Order\.find\({ assignedStaffId: req\.user\._id }\);\s+const assignedStudentIds = orders\.map\(o => o\.userId\)\.filter\(Boolean\);/g,
  `const { getAuthorizedStaffStudents } = await import("../utils/staffAccess.js");
    const assignedStudentIds = await getAuthorizedStaffStudents(req.user._id);`
);

fs.writeFileSync(filePaths.certificate, cert);

console.log("Patched successfully!");
