const fs = require('fs');

// Helper functions to inject at the top of each file
const HELPERS = `
// ─── Date Helpers ─────────────────────────────────────────────────────────────
const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";
const fmtDateTime = (iso) =>
  iso ? new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true }) : "—";
const fmtTime = (iso) =>
  iso ? new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }) : "—";
// ─────────────────────────────────────────────────────────────────────────────
`;

function injectHelpers(content, filename) {
  if (content.includes('const fmtDate =')) return content; // already has helpers
  // Inject after first import block (find last import line)
  const lines = content.split('\n');
  let lastImport = 0;
  lines.forEach((line, i) => {
    if (line.trim().startsWith('import ')) lastImport = i;
  });
  lines.splice(lastImport + 1, 0, HELPERS);
  console.log(`  ✓ Injected helpers into ${filename}`);
  return lines.join('\n');
}

// ─── StaffAssignmentsPage.js ──────────────────────────────────────────────────
{
  let c = fs.readFileSync('src/pages/Staff/StaffAssignmentsPage.js', 'utf8');
  c = injectHelpers(c, 'StaffAssignmentsPage.js');
  // Replace date displays
  c = c.replace(
    `{new Date(activeAssignment.createdAt).toLocaleString()}`,
    `{fmtDateTime(activeAssignment.createdAt)}`
  );
  c = c.replace(
    `{new Date(taskDueDate).toLocaleDateString()}`,
    `{fmtDate(taskDueDate)}`
  );
  // Replace two instances of toLocaleDateString for task due dates
  c = c.replace(
    `{new Date(task.dueDate).toLocaleDateString()}`,
    `{fmtDate(task.dueDate)}`
  );
  // Replace date input with styled wrapper (keep native but overlay display)
  c = c.replace(
    `<NeonInput label="Due Date" type="date" value={taskDueDate} onChange={e => setTaskDueDate(e.target.value)} />`,
    `<div className="flex flex-col gap-1">
                               <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Due Date</label>
                               <div className="relative">
                                 <div className="flex items-center gap-3 bg-white/5 border border-slate-600 text-white rounded-xl px-4 py-3 pointer-events-none">
                                   <span className="text-primary">📅</span>
                                   <span className={taskDueDate ? "text-white text-sm" : "text-slate-500 text-sm"}>{taskDueDate ? fmtDate(taskDueDate) : "Select due date…"}</span>
                                 </div>
                                 <input type="date" value={taskDueDate} onChange={e => setTaskDueDate(e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                               </div>
                             </div>`
  );
  fs.writeFileSync('src/pages/Staff/StaffAssignmentsPage.js', c);
  console.log('Updated StaffAssignmentsPage.js');
}

// ─── StaffDoubtCenterPage.js ──────────────────────────────────────────────────
{
  let c = fs.readFileSync('src/pages/Staff/StaffDoubtCenterPage.js', 'utf8');
  c = injectHelpers(c, 'StaffDoubtCenterPage.js');
  // Replace all toLocaleString date displays
  c = c.replaceAll(
    `new Date(activeDoubt.createdAt).toLocaleString()`,
    `fmtDateTime(activeDoubt.createdAt)`
  );
  c = c.replaceAll(
    `new Date(reply.createdAt).toLocaleString()`,
    `fmtDateTime(reply.createdAt)`
  );
  c = c.replace(
    `new Date(activeDoubt.replies[0].createdAt).toLocaleString()`,
    `fmtDateTime(activeDoubt.replies[0].createdAt)`
  );
  fs.writeFileSync('src/pages/Staff/StaffDoubtCenterPage.js', c);
  console.log('Updated StaffDoubtCenterPage.js');
}

// ─── StaffMeetingsPage.js ─────────────────────────────────────────────────────
{
  let c = fs.readFileSync('src/pages/Staff/StaffMeetingsPage.js', 'utf8');
  c = injectHelpers(c, 'StaffMeetingsPage.js');
  // Upcoming meeting date
  c = c.replace(
    `{new Date(upcomingMeeting.date).toLocaleDateString()}`,
    `{fmtDate(upcomingMeeting.date)}`
  );
  // Upcoming meeting time
  c = c.replace(
    `{new Date(upcomingMeeting.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    `{fmtTime(upcomingMeeting.date)}`
  );
  // Meeting list date
  c = c.replace(
    `{new Date(m.date).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`,
    `{fmtDateTime(m.date)}`
  );
  fs.writeFileSync('src/pages/Staff/StaffMeetingsPage.js', c);
  console.log('Updated StaffMeetingsPage.js');
}

// ─── StaffQuizPage.js ─────────────────────────────────────────────────────────
{
  let c = fs.readFileSync('src/pages/Staff/StaffQuizPage.js', 'utf8');
  c = injectHelpers(c, 'StaffQuizPage.js');
  // Table cell date
  c = c.replace(
    `{new Date(res.completionDate || res.createdAt).toLocaleDateString()}`,
    `{fmtDate(res.completionDate || res.createdAt)}`
  );
  // CSV export date
  c = c.replace(
    `new Date(r.completionDate).toLocaleDateString()`,
    `fmtDate(r.completionDate)`
  );
  fs.writeFileSync('src/pages/Staff/StaffQuizPage.js', c);
  console.log('Updated StaffQuizPage.js');
}

console.log('\n✅ All staff pages date formats updated!');
