import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiFolder, FiSend, FiCheckCircle, FiClock, FiXCircle,
  FiMessageSquare, FiCalendar, FiGithub, FiExternalLink,
  FiStar, FiActivity, FiChevronRight, FiCode,
  FiZap, FiLoader, FiRefreshCw, FiBox,
  FiTag, FiLink2, FiX, FiUsers, FiAward, FiBriefcase
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import {
  useGetCourseProjectTasksQuery,
  useGetStudentProjectsQuery,
  useSubmitProjectMutation,
  useStudentReplyProjectMutation
} from "../redux/features/courses/coursesApi";

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

const fmtDateTime = (iso) =>
  iso ? new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true }) : "—";

const getProjectPercentage = (marks) => (marks && marks <= 10) ? marks * 10 : (marks || 0);
const getDifficulty = (title = "") => ["Beginner", "Intermediate", "Advanced"][title.length % 3];
const getPriority   = (title = "") => ["Low", "Medium", "High"][title.length % 3];
const getTechStack  = (title = "") => {
  const stacks = [
    ["React", "Node.js", "MongoDB"],
    ["Python", "Django", "PostgreSQL"],
    ["Vue.js", "Express", "MySQL"],
    ["Next.js", "Prisma", "Supabase"],
  ];
  return stacks[title.length % stacks.length];
};
const getSkills = (title = "") =>
  ["System Design", "REST APIs", "State Management", "Database Modeling", "UI Engineering"].slice(0, (title.length % 3) + 2);

const difficultyStyle = {
  Beginner:     "bg-emerald-50 text-emerald-700 border-emerald-200",
  Intermediate: "bg-sky-50 text-sky-700 border-sky-200",
  Advanced:     "bg-violet-50 text-violet-700 border-violet-200",
};
const priorityStyle = {
  Low:    "bg-slate-50 text-slate-600 border-slate-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  High:   "bg-rose-50 text-rose-700 border-rose-200",
};

const getGradeLabel = (marks) => {
  const p = getProjectPercentage(marks);
  if (p >= 90) return "A";
  if (p >= 80) return "B";
  if (p >= 70) return "C";
  return "F";
};

// ─── Main Component ───────────────────────────────────────────────────────────
const WorkspaceProjects = ({ activeCourseId, user, globalCourseName }) => {
  const { data: tasksData, isLoading: isLoadingTasks } = useGetCourseProjectTasksQuery(activeCourseId, { skip: !activeCourseId });
  const projectTasks = tasksData?.projectTasks || [];

  const { data: submissionsData, isLoading: isLoadingSubmissions, refetch } = useGetStudentProjectsQuery(activeCourseId, { skip: !activeCourseId });
  const submissions = submissionsData?.projects || [];

  const [submitProject, { isLoading: isSubmitting }] = useSubmitProjectMutation();
  const [replyProject, { isLoading: isReplying }] = useStudentReplyProjectMutation();

  const [selectedTask, setSelectedTask]     = useState(null);
  const [submissionLink, setSubmissionLink] = useState("");
  const [message, setMessage]               = useState("");
  const [replyMessage, setReplyMessage]     = useState("");
  const [activeTab, setActiveTab]           = useState("pending");


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!submissionLink) return toast.error("Please provide a submission link (GitHub/Zip URL)");
    try {
      await submitProject({ courseId: activeCourseId, projectTaskId: selectedTask._id, submissionLink, message }).unwrap();
      toast.success("Project submitted successfully!");
      setSubmissionLink("");
      setMessage("");
      setSelectedTask(null);
      refetch();
    } catch (error) {
      toast.error(typeof (error?.data?.message || "Error submitting project") === "string" ? (error?.data?.message || "Error submitting project") : JSON.stringify(error?.data?.message || "Error submitting project") || "An error occurred");
    }
  };

  const handleReply = async (e, projectId) => {
    e.preventDefault();
    if (!replyMessage) return toast.error("Please enter a message");
    try {
      await replyProject({ projectId, message: replyMessage }).unwrap();
      toast.success("Reply sent");
      setReplyMessage("");
      refetch();
    } catch (error) {
      toast.error(typeof (error?.data?.message || "Error sending reply") === "string" ? (error?.data?.message || "Error sending reply") : JSON.stringify(error?.data?.message || "Error sending reply") || "An error occurred");
    }
  };

  // ── derived data ──────────────────────────────────────────────────────────
  const submittedTaskIds = submissions.map(s => s.projectTaskId?._id || s.projectTaskId);
  const pendingTasks     = projectTasks.filter(t => !submittedTaskIds.includes(t._id));
  const totalXP          = submissions.reduce((acc, s) => acc + Math.floor(getProjectPercentage(s.marks) * 2), 0);
  const approved         = submissions.filter(s => s.status === "approved").length;

  // ── No course selected ────────────────────────────────────────────────────
  if (!activeCourseId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6 bg-[#FAFAFA] font-sans">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#9CA3AF] mb-5 border border-[#E5E7EB]">
          <FiFolder size={28} />
        </div>
        <h2 className="text-xl font-bold text-[#111827] mb-2 tracking-tight">Projects Workspace</h2>
        <p className="text-[#6B7280] text-sm font-medium">Select a course from 'My Learning' to view your projects.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden w-full bg-[#FAFAFA] font-sans">

      {/* ── STICKY HEADER ──────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-[#E5E7EB] sticky top-0 z-10 shrink-0">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 h-16 flex items-center gap-6">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-[19px] font-bold text-[#0F172A] tracking-tight leading-none whitespace-nowrap">Projects</h1>
            <div className="hidden sm:flex items-center gap-2 min-w-0 pl-3 border-l border-[#E2E8F0]">
              <span className="text-[13px] font-semibold text-[#334155] truncate max-w-[220px]">{globalCourseName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── SCROLLABLE BODY ────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto w-full">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-8 space-y-8 pb-16">

          {/* ── KPI CARDS ──────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {[
              { label: "Total Projects", value: projectTasks.length, icon: <FiBriefcase size={18} strokeWidth={2.5} />, color: "text-slate-600", bg: "bg-slate-100", accent: "bg-slate-400", track: "bg-slate-100", ratio: 1 },
              { label: "Submitted",      value: submissions.length,  icon: <FiCheckCircle size={18} strokeWidth={2.5} />, color: "text-emerald-600", bg: "bg-emerald-100", accent: "bg-emerald-500", track: "bg-emerald-100", ratio: submissions.length / (projectTasks.length || 1) },
              { label: "Pending",        value: pendingTasks.length, icon: <FiClock size={18} strokeWidth={2.5} />,       color: "text-amber-600",   bg: "bg-amber-100",   accent: "bg-amber-500",   track: "bg-amber-100",   ratio: pendingTasks.length / (projectTasks.length || 1) },
              { label: "Total XP",       value: totalXP,             icon: <FiStar size={18} strokeWidth={2.5} />,        color: "text-indigo-600",  bg: "bg-indigo-100",  accent: "bg-indigo-500",  track: "bg-indigo-100",  ratio: (totalXP % 500) / 500 },
            ].map((kpi, idx) => (
              <div key={idx} className="bg-white border border-[#E2E8F0] rounded-[14px] p-5 shadow-[0_1px_2px_0_rgb(0,0,0,0.02)] hover:shadow-[0_4px_10px_-2px_rgb(0,0,0,0.06)] hover:-translate-y-[1px] hover:border-[#CBD5E1] transition-all duration-200 flex flex-col justify-between group overflow-hidden">
                <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.05em] mb-3">{kpi.label}</p>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0 ${kpi.bg} ${kpi.color} group-hover:scale-105 transition-transform`}>
                    {kpi.icon}
                  </div>
                  <h3 className="text-[24px] font-black text-[#0F172A] tracking-tight leading-none" style={{ fontVariantNumeric: "tabular-nums" }}>{kpi.value}</h3>
                </div>
                <div className="flex gap-[3px] mt-4">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className={`h-[4px] flex-1 rounded-[1px] transition-colors duration-500 ease-out ${i < Math.round(Math.min(Math.max(kpi.ratio, 0), 1) * 12) ? kpi.accent : kpi.track}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* ── TABS ───────────────────────────────────────────────────────── */}
          <div className="flex items-center gap-2 border-b border-[#E2E8F0]">
            {[
              { key: "pending",   label: "To Do",      count: pendingTasks.length },
              { key: "submitted", label: "Submissions", count: submissions.length },
            ].map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`relative px-4 py-3 text-[14px] font-semibold capitalize transition-all flex items-center gap-2 ${activeTab === tab.key ? "text-[#0F172A]" : "text-[#64748B] hover:text-[#334155]"}`}>
                {tab.label}
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${activeTab === tab.key ? "bg-[#0F172A] text-white" : "bg-[#F1F5F9] text-[#64748B]"}`}>
                  {tab.count}
                </span>
                {activeTab === tab.key && (
                  <motion.div layoutId="projectTabIndicator" className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#0F172A]" />
                )}
              </button>
            ))}
          </div>

          {/* ── TAB CONTENT ────────────────────────────────────────────────── */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="pb-10"
          >
            {/* PENDING TAB */}
            {activeTab === "pending" && (
              <div className="flex flex-col gap-5">
                {isLoadingTasks ? (
                  <div className="animate-pulse flex flex-col gap-5">
                    {[1, 2].map(i => <div key={i} className="h-[140px] bg-white border border-[#E2E8F0] rounded-2xl" />)}
                  </div>
                ) : pendingTasks.length > 0 ? (
                  pendingTasks.map((task, i) => (
                    <div key={i} className="bg-white border border-[#E2E8F0] rounded-2xl p-6 lg:p-8 hover:border-[#CBD5E1] shadow-[0_1px_2px_0_rgb(0,0,0,0.02)] hover:shadow-md transition-all duration-200 group flex flex-col lg:flex-row gap-6 lg:gap-10 justify-between items-start lg:items-center">
                      <div className="flex-1 min-w-0 flex flex-col gap-3.5">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg lg:text-[19px] font-bold text-[#0F172A] leading-tight tracking-tight">{task.title}</h3>
                          <span className={`text-[11px] uppercase font-bold px-2.5 py-1 rounded-md border flex-shrink-0 ${difficultyStyle[getDifficulty(task.title)]}`}>
                            {getDifficulty(task.title)}
                          </span>
                          <span className={`text-[11px] uppercase font-bold px-2.5 py-1 rounded-md border flex-shrink-0 ${priorityStyle[getPriority(task.title)]}`}>
                            {getPriority(task.title)} Priority
                          </span>
                        </div>
                        <p className="text-[14px] text-[#475569] leading-relaxed line-clamp-2 max-w-4xl break-words">{task.description}</p>
                        <div className="flex flex-wrap items-center gap-5 text-[13px] font-semibold mt-1">
                          <div className="flex items-center gap-1.5 text-[#D97706] bg-[#FEF3C7]/50 px-2.5 py-1 rounded-lg border border-[#FDE68A]/60">
                            <FiClock className="text-sm" /> Due: {fmtDateTime(task.dueDate)}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[#94A3B8] font-medium">Stack:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {getTechStack(task.title).map(tech => (
                                <span key={tech} className="bg-[#F8FAFC] text-[#475569] px-2.5 py-1 rounded-md border border-[#E2E8F0] font-medium text-[12px]">{tech}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => { setSelectedTask(task); setSubmissionLink(""); setMessage(""); }}
                        className="w-full lg:w-auto bg-[#0F172A] text-white px-7 py-3 rounded-xl text-[14px] font-semibold hover:bg-[#1E293B] hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-[0_2px_4px_rgb(0,0,0,0.1)] hover:shadow-[0_4px_8px_rgb(0,0,0,0.12)] shrink-0 flex items-center justify-center gap-2">
                        <FiSend className="text-base" /> Submit Project
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="bg-white border border-[#E2E8F0] border-dashed rounded-3xl p-16 text-center flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mb-6 shadow-sm border border-emerald-100">
                      <FiCheckCircle size={36} />
                    </div>
                    <h3 className="text-[20px] font-bold text-[#0F172A] mb-2 tracking-tight">All Projects Submitted!</h3>
                    <p className="text-[#64748B] text-[15px] max-w-md mx-auto leading-relaxed">You've submitted all assigned projects. Check the 'Submissions' tab for evaluation status.</p>
                  </div>
                )}
              </div>
            )}

            {/* SUBMITTED TAB */}
            {activeTab === "submitted" && (
              <div className="flex flex-col gap-6">
                {isLoadingSubmissions ? (
                  <div className="animate-pulse flex flex-col gap-6">
                    {[1, 2].map(i => <div key={i} className="h-[220px] bg-white border border-[#E2E8F0] rounded-3xl" />)}
                  </div>
                ) : submissions.length > 0 ? (
                  submissions.map((sub, i) => {
                    const pct = getProjectPercentage(sub.marks);
                    return (
                      <div key={i} className="bg-white border border-[#E2E8F0] rounded-3xl overflow-hidden shadow-[0_1px_3px_0_rgb(0,0,0,0.02)] hover:shadow-md transition-shadow duration-300 flex flex-col">
                        {/* Card header */}
                        <div className="px-8 py-5 border-b border-[#E2E8F0] flex flex-col md:flex-row justify-between gap-4 md:items-center bg-gradient-to-b from-[#FAFAFA] to-white">
                          <div className="flex flex-col gap-2">
                            <h3 className="text-[18px] font-bold text-[#0F172A] tracking-tight">{sub.projectTaskId?.title || "Project"}</h3>
                            <div className="flex flex-wrap items-center gap-3">
                              <span className={`text-[11px] uppercase font-bold px-2.5 py-1 rounded-md border flex items-center gap-1.5 ${
                                sub.status === "pending"            ? "bg-blue-50 text-blue-700 border-blue-200" :
                                sub.status === "approved"           ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                sub.status === "revision_requested" ? "bg-amber-50 text-amber-700 border-amber-200" :
                                "bg-red-50 text-red-700 border-red-200"
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  sub.status === "pending" ? "bg-blue-500" :
                                  sub.status === "approved" ? "bg-emerald-500" :
                                  sub.status === "revision_requested" ? "bg-amber-500" : "bg-red-500"
                                }`} />
                                {sub.status === "pending" ? "Under Review" : sub.status === "approved" ? "Approved" : sub.status === "revision_requested" ? "Revision Requested" : "Rejected"}
                              </span>
                              <span className="text-[13px] text-[#64748B] font-medium flex items-center gap-1.5">
                                <FiCalendar className="text-[#94A3B8]" size={12} /> Submitted {fmtDate(sub.createdAt || new Date())}
                              </span>
                              {sub.updatedAt && sub.updatedAt !== sub.createdAt && (
                                <span className="text-[13px] text-[#64748B] font-medium flex items-center gap-1.5">
                                  <FiRefreshCw className="text-[#94A3B8]" size={12} /> Updated {fmtDate(sub.updatedAt)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Card body */}
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.5fr] divide-y lg:divide-y-0 lg:divide-x divide-[#E2E8F0]">
                          {/* Score column */}
                          <div className="flex flex-col items-center justify-center p-8 bg-[#FAFAFA]">
                            {sub.status === "pending" ? (
                              <>
                                <div className="w-24 h-24 rounded-full border-[6px] border-amber-100 flex items-center justify-center mb-5 bg-white shadow-sm">
                                  <FiActivity className="text-amber-500 text-3xl animate-pulse" />
                                </div>
                                <h4 className="text-[15px] font-bold text-[#0F172A] tracking-tight">Under Review</h4>
                                <p className="text-[13px] text-[#64748B] mt-1.5 text-center">Your mentor is evaluating your work.</p>
                              </>
                            ) : (
                              <>
                                <div className="relative w-[110px] h-[110px] mb-5">
                                  <svg className="w-full h-full transform -rotate-90 drop-shadow-sm" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="42" stroke="#F1F5F9" strokeWidth="8" fill="none" />
                                    <circle cx="50" cy="50" r="42"
                                      stroke={pct >= 70 ? "#10B981" : "#EF4444"}
                                      strokeWidth="8" fill="none" strokeLinecap="round"
                                      strokeDasharray="263.89"
                                      strokeDashoffset={263.89 - (263.89 * pct) / 100}
                                      className="transition-all duration-1000 ease-out"
                                    />
                                  </svg>
                                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-[32px] font-black text-[#0F172A] tracking-tighter leading-none">{sub.marks || 0}</span>
                                  </div>
                                  <div className={`absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-[14px] text-white shadow-md ring-2 ring-white ${
                                    pct >= 90 ? "bg-indigo-500" : pct >= 80 ? "bg-blue-500" : pct >= 70 ? "bg-emerald-500" : "bg-red-500"
                                  }`}>{getGradeLabel(sub.marks || 0)}</div>
                                </div>
                                <h4 className="text-[15px] font-bold text-[#0F172A] tracking-tight">Evaluation Complete</h4>
                                <div className="flex items-center gap-1.5 text-[13px] font-bold text-indigo-700 mt-2.5 bg-indigo-50 px-3.5 py-1 rounded-full border border-indigo-100">
                                  <FiStar className="text-sm" /> +{Math.floor(pct * 2)} XP
                                </div>
                              </>
                            )}
                          </div>

                          {/* Info column */}
                          <div className="p-8 flex flex-col gap-7 bg-white">
                            {/* Timeline */}
                            <div>
                              <h4 className="text-[12px] font-bold text-[#94A3B8] uppercase tracking-[0.1em] mb-5 flex items-center gap-2">
                                <FiActivity /> Status Timeline
                              </h4>
                              <div className="relative pl-6 border-l-2 border-[#E2E8F0] flex flex-col gap-7">
                                <div className="relative">
                                  <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 bg-[#3B82F6] rounded-full ring-[6px] ring-white shadow-sm" />
                                  <h5 className="text-[14px] font-bold text-[#0F172A] leading-none mb-1.5">Project Submitted</h5>
                                  <p className="text-[13px] text-[#64748B]">{fmtDateTime(sub.createdAt || new Date())}</p>
                                </div>
                                {sub.status !== "pending" && (
                                  <div className="relative">
                                    <div className={`absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full ring-[6px] ring-white shadow-sm ${
                                      sub.status === "approved" ? "bg-[#10B981]" :
                                      sub.status === "revision_requested" ? "bg-amber-500" : "bg-[#EF4444]"
                                    }`} />
                                    <h5 className="text-[14px] font-bold text-[#0F172A] leading-none mb-1.5">
                                      {sub.status === "approved" ? "Approved by Mentor" : sub.status === "revision_requested" ? "Revision Requested" : "Rejected"}
                                    </h5>
                                    <p className="text-[13px] text-[#64748B]">On {fmtDate(sub.updatedAt || sub.createdAt)}</p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Submission link */}
                            <div>
                              <h4 className="text-[12px] font-bold text-[#94A3B8] uppercase tracking-[0.1em] mb-3 flex items-center gap-2">
                                <FiLink2 /> Submitted Link
                              </h4>
                              <a href={sub.submissionLink} target="_blank" rel="noreferrer"
                                className="inline-flex items-center gap-2 text-[13px] font-semibold text-blue-600 hover:text-blue-800 underline underline-offset-2 decoration-blue-200 hover:decoration-blue-600 transition-all">
                                <FiGithub size={13} /> {sub.submissionLink}
                              </a>
                            </div>

                          </div>
                        </div>

                        {/* ── Inline Chat ────────────────────────────────── */}
                        <div className="border-t border-[#E2E8F0]">
                          <div className="px-8 py-4 bg-[#FAFAFA] border-b border-[#E2E8F0] flex items-center gap-2">
                            <FiMessageSquare size={13} className="text-[#64748B]" />
                            <p className="text-[13px] font-bold text-[#0F172A]">Feedback & Discussion</p>
                            {sub.replies?.length > 0 && (
                              <span className="ml-auto text-[11px] font-bold bg-[#F1F5F9] text-[#64748B] px-2 py-0.5 rounded-full">{sub.replies.length}</span>
                            )}
                          </div>
                          <div className="px-8 py-5 flex flex-col gap-4">
                            {sub.replies?.length > 0 ? (
                              sub.replies.map((reply, ri) => (
                                <div key={ri} className={`flex gap-3 ${reply.sender === "student" ? "flex-row-reverse" : ""}`}>
                                  <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-[12px] ${reply.sender === "student" ? "bg-[#0F172A]" : "bg-[#6366F1]"}`}>
                                    {reply.sender === "student" ? (user?.name?.charAt(0) || "S") : "M"}
                                  </div>
                                  <div className={`max-w-[72%] ${reply.sender === "student" ? "text-right" : ""}`}>
                                    <div className={`inline-block px-4 py-3 rounded-2xl text-[13px] leading-relaxed font-medium ${
                                      reply.sender === "student"
                                        ? "bg-[#0F172A] text-white rounded-tr-sm"
                                        : "bg-[#F8FAFC] border border-[#E5E7EB] text-[#334155] rounded-tl-sm"
                                    }`}>{reply.message}</div>
                                    <p className="text-[11px] text-[#94A3B8] mt-1.5">{fmtDateTime(reply.createdAt)}</p>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="py-5 text-center">
                                <FiMessageSquare size={20} className="text-slate-200 mx-auto mb-2" />
                                <p className="text-[13px] font-semibold text-[#94A3B8]">No messages yet — your mentor will leave feedback here.</p>
                              </div>
                            )}
                          </div>
                          <div className="px-8 pb-7 pt-2">
                            <form onSubmit={(e) => handleReply(e, sub._id)} className="flex flex-col gap-3">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-[#0F172A] rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0 mt-1">
                                  {user?.name?.charAt(0) || "S"}
                                </div>
                                <textarea
                                  rows={3}
                                  className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] focus:border-[#0F172A] focus:bg-white rounded-xl px-4 py-3 text-[13px] text-[#0F172A] placeholder-[#94A3B8] font-medium resize-none focus:outline-none transition-all leading-relaxed"
                                  placeholder="Write a reply to your mentor..."
                                  value={replyMessage}
                                  onChange={(e) => setReplyMessage(e.target.value)}
                                />
                              </div>
                              <div className="flex justify-end pl-11">
                                <button type="submit" disabled={isReplying || !replyMessage.trim()}
                                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all ${
                                    replyMessage.trim()
                                      ? 'bg-[#0F172A] text-white hover:bg-[#1E293B] shadow-sm hover:shadow-md hover:-translate-y-0.5'
                                      : 'bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed'
                                  }`}>
                                  {isReplying ? <FiLoader size={13} className="animate-spin" /> : <FiSend size={13} />}
                                  {isReplying ? 'Sending...' : 'Send Reply'}
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="bg-white border border-[#E2E8F0] border-dashed rounded-3xl p-16 text-center flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-[#F1F5F9] rounded-2xl flex items-center justify-center text-[#94A3B8] mb-6 shadow-sm border border-[#E2E8F0]">
                      <FiFolder size={36} />
                    </div>
                    <h3 className="text-[20px] font-bold text-[#0F172A] mb-2 tracking-tight">No Submissions Yet</h3>
                    <p className="text-[#64748B] text-[15px] max-w-md mx-auto leading-relaxed">You haven't submitted any projects yet. Switch to the 'To Do' tab to get started.</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* ── SUBMIT MODAL ───────────────────────────────────────────────────── */}
      {createPortal(
      <AnimatePresence>
        {selectedTask && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-[2px] z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ scale: 0.97, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.97, opacity: 0, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-[24px] w-full max-w-2xl shadow-[0_20px_25px_-5px_rgb(0,0,0,0.1),0_8px_10px_-6px_rgb(0,0,0,0.1)] overflow-hidden flex flex-col max-h-[90vh] border border-[#E2E8F0]">
              {/* Modal header */}
              <div className="px-8 py-6 border-b border-[#E2E8F0] flex items-center justify-between bg-white shrink-0">
                <h2 className="text-[18px] font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
                  <FiSend className="text-[#64748B]" /> Submit Project
                </h2>
                <button onClick={() => { setSelectedTask(null); setSubmissionLink(""); setMessage(""); }}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F8FAFC] text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#0F172A] transition-colors">
                  <FiX className="text-lg" />
                </button>
              </div>

              <div className="p-8 overflow-y-auto bg-[#FAFAFA]">
                {/* Project info */}
                <div className="mb-7">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md border ${difficultyStyle[getDifficulty(selectedTask.title)]}`}>
                      {getDifficulty(selectedTask.title)}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md border ${priorityStyle[getPriority(selectedTask.title)]}`}>
                      {getPriority(selectedTask.title)} Priority
                    </span>
                  </div>
                  <h3 className="text-[20px] font-bold text-[#0F172A] mb-3 tracking-tight leading-tight">{selectedTask.title}</h3>
                  <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] text-[14px] text-[#475569] leading-relaxed shadow-sm break-words">
                    {selectedTask.description}
                  </div>
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#E2E8F0]">
                    <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest">Stack</span>
                    {getTechStack(selectedTask.title).map(t => (
                      <span key={t} className="text-[12px] font-semibold bg-white text-[#334155] px-2.5 py-1 rounded-md border border-[#E2E8F0]">{t}</span>
                    ))}
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-[13px] font-bold text-[#334155] mb-2">
                    Project URL <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <FiGithub size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                    <input type="url" required value={submissionLink}
                      onChange={(e) => setSubmissionLink(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] focus:border-[#0F172A] rounded-xl text-[14px] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none transition-all shadow-sm"
                      placeholder="https://github.com/username/project-name"
                    />
                  </div>
                  <p className="text-[12px] text-[#94A3B8] mt-1.5 flex items-center gap-1"><FiTag size={10} /> GitHub repo, live demo URL, or ZIP download link</p>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-[#334155] mb-2">
                    Note to Mentor <span className="text-[#94A3B8] font-normal text-[12px]">— optional</span>
                  </label>
                  <textarea value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] focus:border-[#0F172A] rounded-xl px-4 py-3 text-[14px] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none transition-all resize-none min-h-[90px] shadow-sm"
                    placeholder="What did you build? Any challenges or areas you'd like feedback on?"
                  />
                </div>
              </div>

              <div className="p-6 md:px-8 border-t border-[#E2E8F0] bg-white flex flex-col-reverse md:flex-row items-stretch md:items-center justify-end gap-3 shrink-0">
                <button onClick={() => { setSelectedTask(null); setSubmissionLink(""); setMessage(""); }}
                  className="py-3 px-6 rounded-xl text-[14px] font-bold bg-white border border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-colors w-full md:w-auto">
                  Cancel
                </button>
                <button onClick={handleSubmit} disabled={isSubmitting || !submissionLink}
                  className={`py-3 px-8 rounded-xl text-[14px] font-bold flex items-center justify-center gap-2 transition-all w-full md:w-auto min-w-[200px] ${
                    submissionLink
                      ? "bg-[#0F172A] text-white hover:bg-[#1E293B] shadow-[0_2px_4px_rgb(0,0,0,0.1)] hover:shadow-[0_4px_8px_rgb(0,0,0,0.15)] hover:-translate-y-0.5"
                      : "bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed border border-[#E2E8F0]"
                  }`}>
                  {isSubmitting ? <FiLoader className="animate-spin text-lg" /> : <FiSend className="text-lg" />}
                  {isSubmitting ? "Submitting..." : "Submit Project"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    )}



    </div>
  );
};

export default WorkspaceProjects;
