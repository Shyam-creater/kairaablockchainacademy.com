import React, { useState, useMemo, useEffect } from "react";
import Heading from "../../components/Heading";
import AdminLayout from "../../components/Admin/AdminLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetStaffAssignmentsQuery,
  useReviewAssignmentMutation,
  useGetStaffAssignedCoursesQuery,
  useCreateAssignmentTaskMutation,
  useGetStaffAssignmentTasksQuery,
  useGetStaffBatchesQuery
} from "../../redux/features/staff/staffApi";
import toast from "react-hot-toast";
import { FaPlus, FaTasks, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { FiCheckSquare, FiClock, FiAlertCircle, FiExternalLink, FiStar, FiActivity, FiUser, FiCalendar, FiFileText } from "react-icons/fi";
import { format } from "timeago.js";

// ─── Date Helpers ─────────────────────────────────────────────────────────────
const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";
const fmtDateTime = (iso) =>
  iso ? new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true }) : "—";
const fmtTime = (iso) =>
  iso ? new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }) : "—";
// ────────────────────────────────────────────────────────────────────────────




// ── Reusable Neon UI Primitives ─────────────────────────────────────────────
const GlassPanel = ({ children, className = "", glow = "" }) => (
  <div className={`bg-surface/40 backdrop-blur-xl border border-white/10 rounded-2xl relative overflow-hidden ${glow} ${className}`}>
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    {children}
  </div>
);

const NeonBadge = ({ status }) => {
  const map = {
    pending:  { label: "Pending",  cls: "bg-warning/10 text-warning  border-warning/30 shadow-[0_0_8px_rgba(255,179,0,0.2)]"  },
    approved: { label: "Approved", cls: "bg-success/10 text-success  border-success/30 shadow-[0_0_8px_rgba(0,230,118,0.2)]"  },
    rejected: { label: "Rejected", cls: "bg-danger/10  text-danger   border-danger/30  shadow-[0_0_8px_rgba(255,23,68,0.2)]"   },
  };
  const { label, cls } = map[status] || map.pending;
  return (
    <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${cls}`}>
      {label}
    </span>
  );
};

const NeonInput = ({ label, ...props }) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>}
    <input
      {...props}
      className="bg-white/5 border border-slate-600 text-white text-sm rounded-xl px-4 py-2.5 outline-none
        focus:border-primary focus:shadow-[0_0_15px_rgba(0,242,254,0.2)] transition-all placeholder-slate-500 w-full"
    />
  </div>
);

const NeonTextarea = ({ label, ...props }) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>}
    <textarea
      {...props}
      className="bg-white/5 border border-slate-600 text-white text-sm rounded-xl px-4 py-2.5 outline-none
        focus:border-primary focus:shadow-[0_0_15px_rgba(0,242,254,0.2)] transition-all placeholder-slate-500 w-full resize-none"
    />
  </div>
);

const NeonSelect = ({ label, children, ...props }) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>}
    <select
      {...props}
      className="bg-[#0B0F19] border border-slate-600 text-white text-sm rounded-xl px-4 py-2.5 outline-none
        focus:border-primary focus:shadow-[0_0_15px_rgba(0,242,254,0.2)] transition-all w-full"
    >
      {children}
    </select>
  </div>
);

const NeonButton = ({ children, onClick, disabled, variant = "primary", className = "" }) => {
  const variants = {
    primary: "bg-primary/10 border-primary/50 text-primary hover:bg-primary/20 hover:shadow-[0_0_20px_rgba(0,242,254,0.3)]",
    success: "bg-success/10 border-success/50 text-success hover:bg-success/20 hover:shadow-[0_0_20px_rgba(0,230,118,0.3)]",
    danger:  "bg-danger/10  border-danger/50  text-danger  hover:bg-danger/20  hover:shadow-[0_0_20px_rgba(255,23,68,0.3)]",
    ghost:   "bg-white/5    border-white/10   text-slate-300 hover:bg-white/10  hover:text-white",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border
        transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// ── Circular Progress Widget ────────────────────────────────────────────────
const CircularProgress = ({ value, max = 100, label, sub, colorClass, hexColor }) => {
  const pct = Math.min((Number(value) / (Number(max) || 1)) * 100, 100);
  const radius = 28;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (pct / 100) * circ;

  return (
    <GlassPanel className="p-5 flex items-center gap-5 hover:-translate-y-1 transition-all duration-300 group">
      <div className="relative w-16 h-16 flex-shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="none" />
          <circle
            cx="32" cy="32" r={radius}
            stroke={hexColor} strokeWidth="6" fill="none" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease", filter: `drop-shadow(0 0 4px ${hexColor}99)` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-[13px] font-extrabold ${colorClass} leading-none`}>{value}</span>
        </div>
      </div>
      <div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-[10px] text-slate-500 font-medium">{sub}</p>
      </div>
    </GlassPanel>
  );
};

// ── Tabs ────────────────────────────────────────────────────────────────────
const TabBar = ({ tabs, active, onChange }) => (
  <div className="flex gap-1 p-1 bg-white/5 border border-white/10 rounded-xl w-fit mb-6">
    {tabs.map((t, i) => (
      <button
        key={i}
        onClick={() => onChange(i)}
        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
          active === i
            ? "bg-primary/20 text-primary border border-primary/40 shadow-[0_0_12px_rgba(0,242,254,0.2)]"
            : "text-slate-400 hover:text-white hover:bg-white/5"
        }`}
      >
        {t}
      </button>
    ))}
  </div>
);

// ── Main Component ──────────────────────────────────────────────────────────
const StaffAssignmentsPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  // Review Submissions API
  const { data, isLoading, refetch } = useGetStaffAssignmentsQuery();
  const assignments = data?.assignments || [];
  const [reviewAssignment, { isLoading: isReviewing }] = useReviewAssignmentMutation();
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [marks, setMarks] = useState("");
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState("approved");

  // Create Task API
  const { data: coursesData } = useGetStaffAssignedCoursesQuery();
  const assignedCourses = coursesData?.assignedCourses || [];
  const [createTask, { isLoading: isCreatingTask }] = useCreateAssignmentTaskMutation();
  const { data: tasksData, refetch: refetchTasks } = useGetStaffAssignmentTasksQuery();
  const assignmentTasks = tasksData?.tasks || [];
  const { data: batchesData } = useGetStaffBatchesQuery();
  const batches = batchesData?.batches || [];

  // Wizard State
  const [wizardStep, setWizardStep] = useState(1);
  const [taskCourseId, setTaskCourseId] = useState("");
  const [taskBatchId, setTaskBatchId] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");

  useEffect(() => {
    if (assignedCourses.length === 1 && !taskCourseId) {
      setTaskCourseId(assignedCourses[0]._id);
    }
  }, [assignedCourses, taskCourseId]);

  const handleReview = async () => {
    if (!activeAssignment || !marks || !feedback || !status) {
      toast.error("Please fill all fields"); return;
    }
    try {
      await reviewAssignment({ assignmentId: activeAssignment._id, marks, feedback, status }).unwrap();
      toast.success("Assignment reviewed successfully");
      setActiveAssignment(null);
      setMarks(""); setFeedback(""); setStatus("approved");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to submit review");
    }
  };

  const handleCreateTask = async () => {
    if (!taskCourseId || !taskTitle || !taskDescription || !taskDueDate) {
      toast.error("Please fill all required fields"); return;
    }
    try {
      await createTask({ courseId: taskCourseId, batchId: taskBatchId || null, title: taskTitle, description: taskDescription, dueDate: taskDueDate }).unwrap();
      toast.success("Assignment task created successfully!");
      setTaskCourseId(""); setTaskBatchId(""); setTaskTitle(""); setTaskDescription(""); setTaskDueDate("");
      setWizardStep(1);
      refetchTasks();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to create task");
    }
  };

  // Analytics
  const pendingCount = assignments.filter(a => a.status === "pending").length;
  const approvedCount = assignments.filter(a => a.status === "approved").length;
  const rejectedCount = assignments.filter(a => a.status === "rejected").length;
  const totalSubmissions = assignments.length;

  // Kanban tasks
  const upcomingTasks = assignmentTasks.filter(t => new Date(t.dueDate) >= new Date());
  const pastTasks = assignmentTasks.filter(t => new Date(t.dueDate) < new Date());

  return (
    <>
      <Heading title="Workspace – Staff Assignments" description="Premium SaaS workspace for reviewing and creating student assignments." keywords="staff, assignments, workspace, grading" />
      <AdminLayout title="Assignment Workspace" subtitle="Review queue & task creation engine">

        {/* Circular Progress Widgets instead of basic KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <CircularProgress value={pendingCount} max={totalSubmissions} label="Pending Review" sub={`${pendingCount} awaiting grading`} colorClass="text-warning" hexColor="#ffb300" />
          <CircularProgress value={approvedCount} max={totalSubmissions} label="Approved" sub={`${approvedCount} successful grades`} colorClass="text-success" hexColor="#00e676" />
          <CircularProgress value={rejectedCount} max={totalSubmissions} label="Needs Rework" sub={`${rejectedCount} rejected items`} colorClass="text-danger" hexColor="#ff1744" />
          <CircularProgress value={assignmentTasks.length} max={assignmentTasks.length} label="Active Tasks" sub="Total tasks deployed" colorClass="text-primary" hexColor="#00f2fe" />
        </div>

        <TabBar tabs={["Review Queue Workspace", "Task Factory & Kanban"]} active={activeTab} onChange={setActiveTab} />

        <AnimatePresence mode="wait">
          {activeTab === 0 && (
            <motion.div key="review-workspace" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="h-full">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
                
                {/* Review Queue Timeline (Left Sidebar) */}
                <GlassPanel className="lg:col-span-4 flex flex-col h-[700px]">
                  <div className="p-5 border-b border-white/5 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white tracking-wide">Review Queue</h3>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">Timeline View</p>
                    </div>
                    <FiActivity className="text-primary" />
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide relative">
                    {/* Timeline vertical line */}
                    <div className="absolute left-[31px] top-4 bottom-4 w-px bg-white/10 z-0"></div>
                    
                    {isLoading ? (
                      <div className="text-center text-slate-500 py-10 text-sm">Loading queue...</div>
                    ) : assignments.length > 0 ? (
                      assignments.map((a, i) => (
                        <div 
                          key={a._id} 
                          onClick={() => { setActiveAssignment(a); setMarks(a.marks || ""); setFeedback(a.feedback || ""); setStatus(a.status !== "pending" ? a.status : "approved"); }}
                          className={`relative z-10 pl-14 pr-4 py-3 rounded-xl cursor-pointer transition-all border ${
                            activeAssignment?._id === a._id 
                              ? "bg-primary/10 border-primary/40 shadow-[0_0_15px_rgba(0,242,254,0.15)]" 
                              : "bg-surface/50 border-white/5 hover:bg-white/5 hover:border-white/10"
                          }`}
                        >
                          {/* Timeline dot */}
                          <div className={`absolute left-[13px] top-1/2 -translate-y-1/2 w-[11px] h-[11px] rounded-full border-2 border-[#0B0F19] ${
                            a.status === 'pending' ? 'bg-warning shadow-[0_0_8px_rgba(255,179,0,0.6)]' :
                            a.status === 'approved' ? 'bg-success shadow-[0_0_8px_rgba(0,230,118,0.6)]' : 'bg-danger shadow-[0_0_8px_rgba(255,23,68,0.6)]'
                          }`}></div>
                          
                          <p className="text-sm font-bold text-white truncate mb-1">{a.assignmentTitle}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-slate-400 truncate max-w-[120px]">{a.studentId?.name}</p>
                            <span className="text-[9px] font-bold text-slate-500">{format(a.createdAt)}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-slate-500 py-10 text-sm">Queue is empty.</div>
                    )}
                  </div>
                </GlassPanel>

                {/* Workspace Split Panel (Right Content) */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                  {activeAssignment ? (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-6">
                      
                      {/* Student Snapshot Header */}
                      <GlassPanel className="p-5 flex items-center justify-between border-l-4 border-l-primary">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold text-lg shadow-[0_0_15px_rgba(0,242,254,0.3)]">
                            {activeAssignment.studentId?.name?.charAt(0) || <FiUser />}
                          </div>
                          <div>
                            <h2 className="text-xl font-extrabold text-white">{activeAssignment.studentId?.name}</h2>
                            <p className="text-xs text-primary mt-0.5 tracking-wide">{activeAssignment.courseId?.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                          <NeonBadge status={activeAssignment.status} />
                        </div>
                      </GlassPanel>

                      {/* Workspace Content Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Submission Details */}
                        <GlassPanel className="p-6">
                          <div className="flex items-center gap-2 mb-5">
                            <FiFileText className="text-slate-400" />
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Submission File</h3>
                          </div>
                          <p className="text-lg font-bold text-white mb-2">{activeAssignment.assignmentTitle}</p>
                          <p className="text-xs text-slate-400 mb-6 flex items-center gap-2"><FiClock /> {fmtDateTime(activeAssignment.createdAt)}</p>
                          
                          <a href={activeAssignment.submittedFile} target="_blank" rel="noreferrer" 
                             className="flex items-center justify-center gap-3 w-full py-4 bg-info/10 border border-info/30 rounded-xl text-info text-sm font-bold hover:bg-info/20 hover:shadow-[0_0_15px_rgba(41,121,255,0.3)] transition-all">
                            <FiExternalLink size={16} /> Open Attachment in New Tab
                          </a>
                        </GlassPanel>

                        {/* Grading Action Panel */}
                        <GlassPanel className="p-6">
                          <div className="flex items-center gap-2 mb-5">
                            <FiCheckSquare className="text-slate-400" />
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Grading Terminal</h3>
                          </div>
                          <div className="flex gap-4 mb-4">
                            <div className="w-1/2">
                              <NeonInput label="Marks Assigned" placeholder="e.g. 9/10" value={marks} onChange={e => setMarks(e.target.value)} />
                            </div>
                            <div className="w-1/2">
                              <NeonSelect label="Decision" value={status} onChange={e => setStatus(e.target.value)}>
                                <option value="approved">✅ Approve</option>
                                <option value="rejected">❌ Reject</option>
                              </NeonSelect>
                            </div>
                          </div>
                          <div className="mb-6">
                            <NeonTextarea label="Staff Feedback" rows={3} placeholder="Provide constructive feedback..." value={feedback} onChange={e => setFeedback(e.target.value)} />
                          </div>
                          <NeonButton onClick={handleReview} disabled={isReviewing} className="w-full py-3">
                            {isReviewing ? "Executing..." : "Publish Review"}
                          </NeonButton>
                        </GlassPanel>
                      </div>
                    </motion.div>
                  ) : (
                    <GlassPanel className="h-[700px] flex flex-col items-center justify-center border-dashed border-white/20 opacity-60 hover:opacity-100 transition-opacity">
                      <div className="w-24 h-24 mb-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                        <FiActivity className="text-primary opacity-50" />
                      </div>
                      <h2 className="text-xl font-bold text-white mb-2">No Assignment Selected</h2>
                      <p className="text-sm text-slate-400 max-w-sm text-center">Select an item from the Review Queue on the left to open it in the grading workspace.</p>
                    </GlassPanel>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 1 && (
            <motion.div key="task-factory" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Multi-step Wizard for Assignment Creation */}
                <GlassPanel className="lg:col-span-5 p-6 h-[650px] flex flex-col">
                  <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/50 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(0,242,254,0.3)]"><FaPlus /></div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Task Factory Wizard</h3>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Step {wizardStep} of 3</p>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
                    <AnimatePresence mode="wait">
                      {wizardStep === 1 && (
                        <motion.div key="step1" initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:20 }} className="space-y-6">
                          <div>
                            <h4 className="text-sm font-bold text-white mb-4">1. Select Target Audience</h4>
                            <NeonSelect label="Target Course" value={taskCourseId} onChange={e => setTaskCourseId(e.target.value)}>
                              <option value="">-- Select a Course --</option>
                              {assignedCourses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                            </NeonSelect>
                          </div>
                          {taskCourseId && (
                            <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }}>
                              <NeonSelect label="Specific Batch (Optional)" value={taskBatchId} onChange={e => setTaskBatchId(e.target.value)}>
                                <option value="">All Students in Course</option>
                                {batches.filter(b => b.courseId?._id === taskCourseId).map(b => (
                                  <option key={b._id} value={b._id}>{b.name} ({b.students?.length} students)</option>
                                ))}
                              </NeonSelect>
                            </motion.div>
                          )}
                          <div className="pt-6 border-t border-white/5 flex justify-end">
                            <NeonButton onClick={() => setWizardStep(2)} disabled={!taskCourseId}>Next Step <FaChevronRight size={10} /></NeonButton>
                          </div>
                        </motion.div>
                      )}

                      {wizardStep === 2 && (
                        <motion.div key="step2" initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:20 }} className="space-y-6">
                          <div>
                            <h4 className="text-sm font-bold text-white mb-4">2. Task Details</h4>
                            <div className="space-y-4">
                              <NeonInput label="Assignment Title" placeholder="e.g. Final DApp Project" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} />
                              <NeonTextarea label="Instructions" rows={4} placeholder="Describe the requirements clearly..." value={taskDescription} onChange={e => setTaskDescription(e.target.value)} />
                              <div className="flex flex-col gap-1">
                               <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Due Date</label>
                               <div className="relative">
                                 <div className="flex items-center gap-3 bg-white/5 border border-slate-600 text-white rounded-xl px-4 py-3 pointer-events-none">
                                   <span className="text-primary">📅</span>
                                   <span className={taskDueDate ? "text-white text-sm" : "text-slate-500 text-sm"}>{taskDueDate ? fmtDate(taskDueDate) : "Select due date…"}</span>
                                 </div>
                                 <input type="date" value={taskDueDate} onChange={e => setTaskDueDate(e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                               </div>
                             </div>
                            </div>
                          </div>
                          <div className="pt-6 border-t border-white/5 flex justify-between">
                            <NeonButton variant="ghost" onClick={() => setWizardStep(1)}><FaChevronLeft size={10} /> Back</NeonButton>
                            <NeonButton onClick={() => setWizardStep(3)} disabled={!taskTitle || !taskDueDate || !taskDescription}>Review <FaChevronRight size={10} /></NeonButton>
                          </div>
                        </motion.div>
                      )}

                      {wizardStep === 3 && (
                        <motion.div key="step3" initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:20 }} className="space-y-6">
                          <div>
                            <h4 className="text-sm font-bold text-white mb-4">3. Final Review</h4>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                              <p className="text-xs text-slate-400">Title: <span className="text-white font-bold block mt-1">{taskTitle}</span></p>
                              <p className="text-xs text-slate-400">Due: <span className="text-warning font-bold block mt-1">{fmtDate(taskDueDate)}</span></p>
                              <p className="text-xs text-slate-400">Audience: <span className="text-primary font-bold block mt-1">Course ID: {taskCourseId.slice(-6)}</span></p>
                            </div>
                          </div>
                          <div className="pt-6 border-t border-white/5 flex justify-between">
                            <NeonButton variant="ghost" onClick={() => setWizardStep(2)}><FaChevronLeft size={10} /> Back</NeonButton>
                            <NeonButton variant="success" onClick={handleCreateTask} disabled={isCreatingTask}>{isCreatingTask ? "Deploying..." : "Deploy Task"}</NeonButton>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </GlassPanel>

                {/* Kanban-style Task Board */}
                <div className="lg:col-span-7 flex flex-col">
                  <div className="flex items-center gap-3 mb-6">
                    <FiCalendar className="text-accent text-xl" />
                    <h3 className="text-lg font-bold text-white">Task Kanban Board</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[580px]">
                    {/* Upcoming Column */}
                    <GlassPanel className="p-4 flex flex-col bg-surface/20">
                      <div className="mb-4 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Active & Upcoming</span>
                        <span className="bg-white/10 text-white text-xs px-2 py-0.5 rounded-full">{upcomingTasks.length}</span>
                      </div>
                      <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-hide">
                        {upcomingTasks.length > 0 ? upcomingTasks.map(task => (
                          <div key={task._id} className="bg-white/5 border border-primary/20 hover:border-primary/50 hover:shadow-[0_0_10px_rgba(0,242,254,0.1)] rounded-xl p-4 transition-all">
                            <p className="text-sm font-bold text-white mb-2 leading-tight">{task.title}</p>
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                              <span className="text-[10px] text-slate-400">{task.courseId?.name || "Unknown Course"}</span>
                              <span className="text-[10px] font-bold text-primary flex items-center gap-1"><FiClock size={10} /> {fmtDate(task.dueDate)}</span>
                            </div>
                          </div>
                        )) : <div className="text-xs text-slate-500 text-center mt-10">No upcoming tasks</div>}
                      </div>
                    </GlassPanel>

                    {/* Past Due / Closed Column */}
                    <GlassPanel className="p-4 flex flex-col bg-surface/20">
                      <div className="mb-4 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Past Due</span>
                        <span className="bg-white/5 text-slate-400 text-xs px-2 py-0.5 rounded-full">{pastTasks.length}</span>
                      </div>
                      <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-hide">
                        {pastTasks.length > 0 ? pastTasks.map(task => (
                          <div key={task._id} className="bg-white/[0.02] border border-white/5 opacity-70 rounded-xl p-4">
                            <p className="text-sm font-bold text-slate-300 mb-2 leading-tight">{task.title}</p>
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                              <span className="text-[10px] text-slate-500">{task.courseId?.name || "Unknown Course"}</span>
                              <span className="text-[10px] font-bold text-danger flex items-center gap-1"><FiAlertCircle size={10} /> {fmtDate(task.dueDate)}</span>
                            </div>
                          </div>
                        )) : <div className="text-xs text-slate-500 text-center mt-10">No past tasks</div>}
                      </div>
                    </GlassPanel>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </AdminLayout>
    </>
  );
};

export default StaffAssignmentsPage;
