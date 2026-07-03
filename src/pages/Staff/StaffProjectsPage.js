import React, { useState, useEffect } from "react";
import Heading from "../../components/Heading";
import AdminLayout from "../../components/Admin/AdminLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetStaffProjectsQuery,
  useStaffReviewProjectMutation,
  useGetStaffAssignedCoursesQuery,
  useCreateProjectTaskMutation,
} from "../../redux/features/staff/staffApi";
import { useGetCourseProjectTasksQuery } from "../../redux/features/courses/coursesApi";
import toast from "react-hot-toast";
import { FaPlus, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { FiCheckSquare, FiClock, FiActivity, FiUser, FiFileText, FiSend, FiMessageSquare, FiCalendar } from "react-icons/fi";
import { format } from "timeago.js";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmtDate = (iso) => {
  if (!iso) return "—";
  let d = new Date(iso);
  if (iso.length === 10 && iso.includes("-")) {
    const [y, m, day] = iso.split("-");
    d = new Date(y, m - 1, day);
  }
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const fmtDateTime = (iso) =>
  iso
    ? new Date(iso).toLocaleString("en-US", {
        month: "short", day: "numeric", year: "numeric",
        hour: "numeric", minute: "2-digit", hour12: true,
      })
    : "—";

// ─── Sub-components ───────────────────────────────────────────────────────────
const GlassPanel = ({ children, className = "", glow = "" }) => (
  <div className={`bg-surface/40 backdrop-blur-xl border border-white/10 rounded-2xl relative overflow-hidden ${glow} ${className}`}>
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    {children}
  </div>
);

const NeonBadge = ({ status }) => {
  const map = {
    pending:  { label: "Pending",  cls: "bg-blue-500/10 text-blue-400  border-blue-400/30"  },
    approved: { label: "Approved", cls: "bg-success/10 text-success  border-success/30"  },
    rejected: { label: "Rejected", cls: "bg-danger/10  text-danger   border-danger/30"   },
    revision_requested: { label: "Revision", cls: "bg-warning/10 text-warning border-warning/30" },
  };
  const { label, cls } = map[status] || map.pending;
  return (
    <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${cls}`}>
      {label}
    </span>
  );
};

// ─── Styled Date Input ────────────────────────────────────────────────────────
const DateInput = ({ value, onChange }) => {
  // value is an ISO date string or ""
  // We store internally as yyyy-mm-dd for the native input
  const toInputVal = (iso) => {
    if (!iso) return "";
    if (iso.length === 10 && iso.includes("-")) return iso; // already yyyy-mm-dd
    const d = new Date(iso);
    if (isNaN(d)) return iso;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const displayVal = value ? fmtDate(value) : "";

  return (
    <div className="relative">
      {/* Decorative display */}
      <div className="flex items-center gap-3 bg-white/5 border border-slate-600 text-white rounded-xl px-4 py-3 pointer-events-none select-none">
        <FiCalendar className="text-primary shrink-0" />
        <span className={`text-sm ${displayVal ? "text-white" : "text-slate-500"}`}>
          {displayVal || "Select due date…"}
        </span>
      </div>
      {/* Invisible native input layered on top */}
      <input
        type="date"
        value={toInputVal(value)}
        onChange={(e) => {
          // Pass the raw yyyy-mm-dd string up so the parent can store & send it
          onChange(e.target.value);
        }}
        onClick={(e) => e.target.showPicker && e.target.showPicker()}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const StaffProjectsPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  // Review Submissions API
  const { data, isLoading, refetch } = useGetStaffProjectsQuery();
  const projects = data?.projects || [];
  const [reviewProject, { isLoading: isReviewing }] = useStaffReviewProjectMutation();
  const [activeProject, setActiveProject] = useState(null);
  const [marks, setMarks] = useState("");
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState("approved");

  // Create Task API
  const { data: coursesData } = useGetStaffAssignedCoursesQuery();
  const assignedCourses = coursesData?.assignedCourses || [];
  const [createTask, { isLoading: isCreatingTask }] = useCreateProjectTaskMutation();

  // Wizard State
  const [wizardStep, setWizardStep] = useState(1);
  const [taskCourseId, setTaskCourseId] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");

  const handleReview = async () => {
    if (!activeProject || (!feedback && !marks && status === activeProject.status)) {
      toast.error("Please provide feedback, marks, or change status"); return;
    }
    try {
      await reviewProject({ projectId: activeProject._id, marks, message: feedback, status }).unwrap();
      toast.success("Project reviewed & feedback sent");
      setFeedback("");
      refetch();
      setActiveProject(prev => ({
          ...prev,
          marks: marks || prev.marks,
          status,
          replies: feedback ? [...prev.replies, { sender: 'staff', message: feedback, createdAt: new Date().toISOString() }] : prev.replies
      }));
    } catch (error) {
      toast.error(error?.data?.message || "Failed to submit review");
    }
  };

  const handleCreateTask = async () => {
    if (!taskCourseId || !taskTitle || !taskDescription || !taskDueDate) {
      toast.error("Please fill all required fields"); return;
    }
    try {
      await createTask({ courseId: taskCourseId, title: taskTitle, description: taskDescription, dueDate: taskDueDate }).unwrap();
      toast.success("Project task assigned successfully!");
      setTaskCourseId(""); setTaskTitle(""); setTaskDescription(""); setTaskDueDate("");
      setWizardStep(1);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to assign project");
    }
  };

  return (
    <>
      <Heading title="Workspace – Staff Projects" description="Manage and review student projects" />
      <AdminLayout title="Project Workspace" subtitle="Review submissions and assign projects">
        
        <div className="flex gap-1 p-1 bg-white/5 border border-white/10 rounded-xl w-fit mb-6">
            <button onClick={() => setActiveTab(0)} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${activeTab === 0 ? "bg-primary/20 text-primary border border-primary/40 shadow-[0_0_12px_rgba(0,242,254,0.2)]" : "text-slate-400 hover:text-white"}`}>Review Queue</button>
            <button onClick={() => setActiveTab(1)} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${activeTab === 1 ? "bg-primary/20 text-primary border border-primary/40 shadow-[0_0_12px_rgba(0,242,254,0.2)]" : "text-slate-400 hover:text-white"}`}>Assign Project</button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 0 && (
            <motion.div key="review-workspace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[750px]">
                {/* Left Sidebar */}
                <GlassPanel className="lg:col-span-4 flex flex-col h-full">
                  <div className="p-5 border-b border-white/5">
                    <h3 className="text-sm font-bold text-white tracking-wide">Project Submissions</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {isLoading ? <div className="text-slate-500 text-sm">Loading...</div> : projects.map(p => (
                      <div key={p._id} onClick={() => { setActiveProject(p); setMarks(p.marks || ""); setStatus(p.status); setFeedback(""); }} className={`p-4 rounded-xl cursor-pointer border ${activeProject?._id === p._id ? 'bg-primary/10 border-primary/40' : 'bg-surface/50 border-white/5 hover:bg-white/5'}`}>
                         <div className="flex justify-between items-start mb-2">
                             <p className="text-sm font-bold text-white">{p.projectTaskId?.title}</p>
                             <NeonBadge status={p.status} />
                         </div>
                         <p className="text-xs text-slate-400 flex items-center gap-1">
                           <FiUser size={10} /> {p.studentId?.name}
                         </p>
                         <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                           <FiCalendar size={10} /> {fmtDate(p.createdAt)}
                         </p>
                      </div>
                    ))}
                    {projects.length === 0 && !isLoading && <div className="text-slate-500 text-sm text-center mt-10">No projects submitted yet.</div>}
                  </div>
                </GlassPanel>

                {/* Right Content */}
                <div className="lg:col-span-8 flex flex-col h-full gap-6">
                  {activeProject ? (
                    <GlassPanel className="flex flex-col h-full">
                      {/* Header */}
                      <div className="p-5 border-b border-white/5 flex justify-between items-center bg-black/20 shrink-0">
                         <div>
                            <h2 className="text-lg font-bold text-white">{activeProject.projectTaskId?.title}</h2>
                            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                              <FiUser size={11} /> {activeProject.studentId?.name}
                              <span className="opacity-40">•</span>
                              <FiCalendar size={11} /> Submitted {fmtDate(activeProject.createdAt)}
                            </p>
                         </div>
                         <div className="flex items-center gap-4">
                             <a href={activeProject.submissionLink} target="_blank" rel="noreferrer" className="text-primary text-sm font-bold flex items-center gap-2 hover:underline"><FiFileText /> View Submission URL</a>
                         </div>
                      </div>

                      {/* Thread */}
                      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-transparent to-black/20">
                         {activeProject.replies?.map((r, i) => (
                           <div key={i} className={`flex gap-4 ${r.sender === 'staff' ? 'flex-row-reverse' : ''}`}>
                               <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs ${r.sender === 'staff' ? 'bg-primary' : 'bg-slate-700'}`}>
                                   {r.sender === 'staff' ? 'You' : activeProject.studentId?.name?.charAt(0)}
                               </div>
                               <div className={`max-w-[75%] p-4 rounded-2xl text-sm ${r.sender === 'staff' ? 'bg-primary/20 text-white rounded-tr-sm border border-primary/30' : 'bg-white/10 text-slate-200 rounded-tl-sm border border-white/5'}`}>
                                   <p className="whitespace-pre-wrap">{r.message}</p>
                                   <p className="text-[10px] text-slate-400 mt-2">{fmtDateTime(r.createdAt)}</p>
                               </div>
                           </div>
                         ))}
                      </div>

                      {/* Grading & Reply Box */}
                      <div className="p-5 border-t border-white/5 bg-black/40 shrink-0">
                          <div className="flex gap-4 mb-4">
                              <input type="text" placeholder="Marks (e.g. 10/10)" value={marks} onChange={e => setMarks(e.target.value)} className="bg-white/5 border border-slate-600 text-white text-sm rounded-xl px-4 py-2 w-1/3 outline-none focus:border-primary" />
                              <select value={status} onChange={e => setStatus(e.target.value)} className="bg-[#0B0F19] border border-slate-600 text-white text-sm rounded-xl px-4 py-2 w-1/3 outline-none focus:border-primary">
                                  <option value="pending">Pending</option>
                                  <option value="approved">Approved</option>
                                  <option value="revision_requested">Revision Requested</option>
                                  <option value="rejected">Rejected</option>
                               </select>
                          </div>
                          <div className="flex gap-2">
                              <input type="text" placeholder="Type your feedback/reply..." value={feedback} onChange={e => setFeedback(e.target.value)} className="flex-1 bg-white/5 border border-slate-600 text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-primary" />
                              <button onClick={handleReview} disabled={isReviewing} className="bg-primary hover:bg-primary/80 text-[#0B0F19] w-12 rounded-xl flex items-center justify-center transition-colors"><FiSend /></button>
                          </div>
                      </div>
                    </GlassPanel>
                  ) : (
                    <GlassPanel className="h-full flex flex-col items-center justify-center opacity-60 text-slate-400">
                        <FiMessageSquare size={40} className="mb-4 text-slate-500" />
                        <p>Select a project submission to review and reply.</p>
                    </GlassPanel>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 1 && (
            <motion.div key="assign-workspace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <GlassPanel className="p-8 max-w-2xl">
                    <h3 className="text-xl font-bold text-white mb-6">Assign New Project</h3>
                    <div className="space-y-5">
                        <div className="flex flex-col gap-2">
                           <label className="text-xs font-bold text-slate-400 uppercase">Target Course</label>
                           <select value={taskCourseId} onChange={e => setTaskCourseId(e.target.value)} className="bg-[#0B0F19] border border-slate-600 text-white rounded-xl px-4 py-3 outline-none focus:border-primary">
                               <option value="">-- Select Course --</option>
                               {assignedCourses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                           </select>
                        </div>
                        <div className="flex flex-col gap-2">
                           <label className="text-xs font-bold text-slate-400 uppercase">Project Title</label>
                           <input type="text" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} placeholder="e.g. Build a DEX" className="bg-white/5 border border-slate-600 text-white rounded-xl px-4 py-3 outline-none focus:border-primary" />
                        </div>
                        <div className="flex flex-col gap-2">
                           <label className="text-xs font-bold text-slate-400 uppercase">Instructions</label>
                           <textarea rows={5} value={taskDescription} onChange={e => setTaskDescription(e.target.value)} placeholder="Describe the project..." className="bg-white/5 border border-slate-600 text-white rounded-xl px-4 py-3 outline-none focus:border-primary" />
                        </div>
                        <div className="flex flex-col gap-2">
                           <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                             <FiCalendar className="text-primary" /> Due Date
                           </label>
                           <DateInput value={taskDueDate} onChange={setTaskDueDate} />
                           {taskDueDate && (
                             <p className="text-xs text-primary font-semibold mt-1">
                               Selected: {fmtDate(taskDueDate)}
                             </p>
                           )}
                        </div>
                        <button onClick={handleCreateTask} disabled={isCreatingTask} className="w-full py-4 bg-primary text-[#0B0F19] font-bold rounded-xl mt-4 hover:bg-primary/90 transition-all">
                            {isCreatingTask ? "Assigning..." : "Assign Project to Students"}
                        </button>
                    </div>
                </GlassPanel>
            </motion.div>
          )}
        </AnimatePresence>
      </AdminLayout>
    </>
  );
};

export default StaffProjectsPage;
