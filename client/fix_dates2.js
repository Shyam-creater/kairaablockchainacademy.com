const fs = require('fs');

// Fix the remaining raw date in StaffAssignmentsPage
let c = fs.readFileSync('src/pages/Staff/StaffAssignmentsPage.js', 'utf8');
c = c.replace(
  `{new Date(task.dueDate).toLocaleDateString()}`,
  `{fmtDate(task.dueDate)}`
);
// The em dash (—) from injected helpers may have been saved with wrong encoding. Fix it.
c = c.replace(
  'iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "\uFFFD";',
  'iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "\u2014";'
);
c = c.replace(
  'iso ? new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true }) : "\uFFFD";',
  'iso ? new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true }) : "\u2014";'
);
c = c.replace(
  'iso ? new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }) : "\uFFFD";',
  'iso ? new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }) : "\u2014";'
);
fs.writeFileSync('src/pages/Staff/StaffAssignmentsPage.js', c);

// Fix em dash in all other staff files
const staffFiles = [
  'src/pages/Staff/StaffDoubtCenterPage.js',
  'src/pages/Staff/StaffMeetingsPage.js',
  'src/pages/Staff/StaffQuizPage.js',
];

for (const fpath of staffFiles) {
  let fc = fs.readFileSync(fpath, 'utf8');
  fc = fc.replaceAll('"\uFFFD"', '"\u2014"');
  fs.writeFileSync(fpath, fc);
  console.log(`Fixed em dash in ${fpath}`);
}

console.log('Done!');
