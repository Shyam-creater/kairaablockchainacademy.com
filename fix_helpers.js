const fs = require('fs');

const DATE_HELPERS = `
// ─── Date Helpers ─────────────────────────────────────────────────────────────
const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "\u2014";
const fmtDateTime = (iso) =>
  iso ? new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true }) : "\u2014";
const fmtTime = (iso) =>
  iso ? new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }) : "\u2014";
// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
`;

const STALE_HELPERS_REGEX = /\n\/\/ \u2500+ Date Helpers \u2500+[\s\S]*?\/\/ \u2500+\n/g;

const files = [
  'src/pages/Staff/StaffQuizPage.js',
  'src/pages/Staff/StaffAssignmentsPage.js',
  'src/pages/Staff/StaffDoubtCenterPage.js',
  'src/pages/Staff/StaffMeetingsPage.js',
];

for (const fpath of files) {
  let c = fs.readFileSync(fpath, 'utf8');

  // 1. Remove any existing injected helpers (wherever they are)
  c = c.replace(STALE_HELPERS_REGEX, '\n');

  // 2. Find last import line index
  const lines = c.split('\n');
  let lastImportIdx = 0;
  lines.forEach((line, i) => {
    if (line.trim().startsWith('import ') || (line.trim().startsWith('} from') && i > 0)) {
      lastImportIdx = i;
    }
  });

  // 3. Re-inject helpers right after the last import line
  lines.splice(lastImportIdx + 1, 0, DATE_HELPERS);
  c = lines.join('\n');

  fs.writeFileSync(fpath, c);
  console.log(`Fixed ${fpath} (helpers after line ${lastImportIdx + 1})`);
}

console.log('\nAll done!');
