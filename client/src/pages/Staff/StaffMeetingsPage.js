import React, { useState, useEffect } from "react";
import Heading from "../../components/Heading";
import AdminLayout from "../../components/Admin/AdminLayout";
import { motion, AnimatePresence } from "framer-motion";
import { useGetAssignedStudentsQuery, useGetStaffAssignedCoursesQuery, useScheduleMeetingMutation, useGetMeetingsQuery, useUploadMeetingRecordingMutation, useGetStaffBatchesQuery } from "../../redux/features/staff/staffApi";
import toast from "react-hot-toast";
import { FiVideo, FiCalendar, FiUpload, FiUsers, FiX, FiExternalLink, FiClock, FiCheckCircle, FiChevronRight, FiPlayCircle, FiBarChart2 } from "react-icons/fi";

// ─── Date Helpers ─────────────────────────────────────────────────────────────
const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";
const fmtDateTime = (iso) =>
  iso ? new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true }) : "—";
const fmtTime = (iso) =>
  iso ? new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }) : "—";
// ────────────────────────────────────────────────────────────────────────────




// ── Neon UI Primitives ─────────────────────────────────────────────────────
const GlassPanel = ({ children, className = "", glow = "" }) => (
  <div className={`bg-surface/40 backdrop-blur-xl border border-white/10 rounded-2xl relative overflow-hidden ${glow} ${className}`}>
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    {children}
  </div>
);

const NeonBadge = ({ status }) => {
  const map = {
    live:      { label: "Live Now",  cls: "bg-danger/20 text-danger border-danger/50 shadow-[0_0_10px_rgba(255,23,68,0.4)] animate-pulse" },
    scheduled: { label: "Scheduled", cls: "bg-primary/10 text-primary border-primary/30" },
    completed: { label: "Completed", cls: "bg-success/10 text-success border-success/30" },
    cancelled: { label: "Cancelled", cls: "bg-slate-500/10 text-slate-400 border-slate-500/30" }
  };
  const { label, cls } = map[status] || map.scheduled;
  return <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${cls}`}>{label}</span>;
};

const NeonInput = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>}
    <input
      {...props}
      className="bg-surface border border-slate-600 text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(0,242,254,0.2)] transition-all placeholder-slate-500 w-full"
    />
  </div>
);

const NeonSelect = ({ label, children, ...props }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>}
    <select
      {...props}
      className="bg-surface border border-slate-600 text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(0,242,254,0.2)] transition-all w-full"
    >
      {children}
    </select>
  </div>
);

const NeonButton = ({ children, onClick, disabled, variant = "primary", className = "", href, target }) => {
  const variants = {
    primary:   "bg-primary/10 border-primary/50 text-primary hover:bg-primary/20 hover:shadow-[0_0_20px_rgba(0,242,254,0.3)]",
    secondary: "bg-accent/10  border-accent/50  text-accent  hover:bg-accent/20  hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]",
    ghost:     "bg-white/5    border-white/10   text-slate-300 hover:bg-white/10 hover:text-white",
    success:   "bg-success/10 border-success/50 text-success hover:bg-success/20 hover:shadow-[0_0_20px_rgba(0,230,118,0.3)]",
  };
  const base = `flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant]} ${className}`;
  if (href) return <a href={href} target={target} className={base}>{children}</a>;
  return <button onClick={onClick} disabled={disabled} className={base}>{children}</button>;
};

const CircularProgress = ({ value, max = 100, label, sub, colorClass, hexColor }) => {
  const pct = Math.min((Number(value) / (Number(max) || 1)) * 100, 100);
  const radius = 28;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (pct / 100) * circ;

  return (
    <GlassPanel className="p-4 flex items-center gap-4 hover:-translate-y-1 transition-all duration-300 group bg-surface/20">
      <div className="relative w-16 h-16 flex-shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="none" />
          <circle cx="32" cy="32" r={radius} stroke={hexColor} strokeWidth="6" fill="none" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease", filter: `drop-shadow(0 0 4px ${hexColor}99)` }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-sm font-extrabold ${colorClass} leading-none`}>{value}</span>
        </div>
      </div>
      <div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-[10px] text-slate-500 font-medium">{sub}</p>
      </div>
    </GlassPanel>
  );
};

// ── Main Component ──────────────────────────────────────────────────────────
const StaffMeetingsPage = () => {
  const { data: studentsData } = useGetAssignedStudentsQuery();
  const { data: coursesData } = useGetStaffAssignedCoursesQuery();
  const { data: meetingsData, refetch: refetchMeetings } = useGetMeetingsQuery();
  const [scheduleMeeting, { isLoading: isScheduling }] = useScheduleMeetingMutation();
  const { data: batchesData } = useGetStaffBatchesQuery();
  const [uploadRecording, { isLoading: isUploading }] = useUploadMeetingRecordingMutation();

  const students = studentsData?.assignedStudents || [];
  const assignedCourses = coursesData?.assignedCourses || [];
  const scheduledMeetings = meetingsData?.meetings || [];
  const batches = batchesData?.batches || [];

  // Drawer / Modal States
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [uploadStep, setUploadStep]           = useState(1);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  // Form States
  const [selectedCourse, setSelectedCourse]   = useState("");
  const [selectedBatch, setSelectedBatch]     = useState("");
  const [meetingTopic, setMeetingTopic]       = useState("");
  const [meetingDate, setMeetingDate]         = useState("");
  const [meetingEndDate, setMeetingEndDate]   = useState("");
  const [zoomLink, setZoomLink]               = useState("");
  const [recordingUrl, setRecordingUrl]       = useState("");
  const [materialFile, setMaterialFile]       = useState("");
  const [materialName, setMaterialName]       = useState("");

  const uniqueCourses = assignedCourses.map(c => ({ id: c._id, name: c.name }));
  const enrolledStudents = students.filter(s => s.course?._id === selectedCourse);

  useEffect(() => {
    if (uniqueCourses.length === 1 && !selectedCourse) {
      setSelectedCourse(uniqueCourses[0].id);
    }
  }, [uniqueCourses, selectedCourse]);

  const upcomingMeeting = scheduledMeetings.find(m => new Date(m.date) > new Date() && m.status !== "completed" && m.status !== "cancelled");
  const completedCount = scheduledMeetings.filter(m => m.status === "completed").length;
  const totalCount = scheduledMeetings.length;

  const handleSchedule = async () => {
    try {
      await scheduleMeeting({ courseId: selectedCourse, batchId: selectedBatch || null, topic: meetingTopic, date: meetingDate, endDate: meetingEndDate, zoomLink: zoomLink }).unwrap();
      toast.success("Zoom Session Scheduled!");
      setMeetingTopic(""); setMeetingDate(""); setMeetingEndDate(""); setZoomLink("");
      setIsSchedulerOpen(false);
      refetchMeetings();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to schedule session");
    }
  };

  const handleOpenUpload = (meeting) => {
    setSelectedMeeting(meeting);
    setRecordingUrl(meeting.recordingUrl || "");
    setMaterialFile(""); setMaterialName("");
    setUploadStep(1);
    setOpenUploadModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => { setMaterialFile(reader.result); setMaterialName(file.name); };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = async () => {
    if (!recordingUrl) { toast.error("Please provide a recording URL"); return; }
    try {
      await uploadRecording({ meetingId: selectedMeeting._id, recordingUrl, materialFile, materialName }).unwrap();
      toast.success("Recording & Materials Uploaded!");
      setOpenUploadModal(false);
      refetchMeetings();
    } catch { toast.error("Failed to upload recording"); }
  };

  // Utility to determine dynamic status
  const getDynamicStatus = (meeting) => {
    if (meeting.status === "completed" || meeting.status === "cancelled") return meeting.status;
    const now = new Date();
    const start = new Date(meeting.date);
    const end = new Date(meeting.endDate);
    if (now >= start && now <= end) return "live";
    return "scheduled";
  };

  return (
    <>
      <Heading title="Live Session Command Center" description="Premium Staff Zoom Integration" keywords="staff, zoom, live session" />
      <AdminLayout title="Live Session Command Center" subtitle="Analytics, Scheduling, and Operations">
        
        {/* Top Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <NeonButton variant="primary" onClick={() => setIsSchedulerOpen(true)}>
              <FiCalendar /> Schedule New Session
            </NeonButton>
            <NeonButton variant="ghost" onClick={refetchMeetings}>
              <FiClock /> Sync Zoom Data
            </NeonButton>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Analytics & Upcoming */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Analytics Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <CircularProgress value={scheduledMeetings.length} max={100} label="Total Sessions" sub="All-time scheduled" colorClass="text-primary" hexColor="#00f2fe" />
              <CircularProgress value={completedCount} max={totalCount || 1} label="Completion Rate" sub="Sessions successfully ended" colorClass="text-success" hexColor="#00e676" />
              
              <GlassPanel className="p-4 flex items-center justify-between bg-surface/20 hover:-translate-y-1 transition-all duration-300">
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Live Analytics</p>
                  <p className="text-sm font-extrabold text-white">Optimal Health</p>
                  <p className="text-[10px] text-slate-500 mt-1">Systems synced</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary text-xl shadow-[0_0_15px_rgba(0,242,254,0.2)]">
                  <FiBarChart2 />
                </div>
              </GlassPanel>
            </div>

            {/* Upcoming Hero Widget */}
            {upcomingMeeting ? (
              <GlassPanel className="p-0 overflow-hidden border-primary/40 shadow-[0_0_30px_rgba(0,242,254,0.1)] relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
                <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <div>
                    <NeonBadge status="scheduled" />
                    <h2 className="text-2xl font-extrabold text-white mt-3 mb-1">{upcomingMeeting.topic}</h2>
                    <p className="text-sm text-slate-300 mb-4">{upcomingMeeting.courseId?.name}</p>
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <span className="flex items-center gap-1.5"><FiCalendar className="text-primary" /> {fmtDate(upcomingMeeting.date)}</span>
                      <span className="flex items-center gap-1.5"><FiClock className="text-primary" /> {fmtTime(upcomingMeeting.date)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 min-w-[200px]">
                    <NeonButton variant="primary" href={upcomingMeeting.zoomLink} target="_blank" className="w-full !py-4 shadow-[0_0_20px_rgba(0,242,254,0.3)]">
                      <FiVideo size={18} /> Join as Host
                    </NeonButton>
                    <NeonButton variant="ghost" className="w-full">
                      <FiUsers /> View Enrolled ({students.filter(s => s.course?._id === upcomingMeeting.courseId?._id).length})
                    </NeonButton>
                  </div>
                </div>
              </GlassPanel>
            ) : (
              <GlassPanel className="p-8 flex flex-col items-center justify-center text-center opacity-70">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 mb-4 text-2xl"><FiCalendar /></div>
                <h2 className="text-xl font-bold text-white mb-2">No Upcoming Sessions</h2>
                <p className="text-sm text-slate-400 mb-6">Schedule a new live class to get started.</p>
                <NeonButton variant="primary" onClick={() => setIsSchedulerOpen(true)}><FiCalendar /> Schedule Now</NeonButton>
              </GlassPanel>
            )}

            {/* Monthly Calendar Mockup */}
            <GlassPanel className="p-6">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><FiCalendar /> Monthly Schedule Preview</h3>
              <div className="grid grid-cols-7 gap-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                  <div key={d} className="text-center text-[10px] font-bold text-slate-500 uppercase">{d}</div>
                ))}
                {[...Array(35)].map((_, i) => {
                  const day = i - 2;
                  const hasMeeting = scheduledMeetings.some(m => new Date(m.date).getDate() === day && new Date(m.date).getMonth() === new Date().getMonth());
                  return (
                    <div key={i} className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all ${day > 0 && day <= 31 ? "bg-white/5 border border-white/10 hover:border-primary/50 text-slate-300" : "opacity-0"} ${hasMeeting ? "bg-primary/20 border-primary/50 text-primary shadow-[0_0_10px_rgba(0,242,254,0.2)]" : ""}`}>
                      {day > 0 && day <= 31 ? day : ""}
                    </div>
                  );
                })}
              </div>
            </GlassPanel>

          </div>

          {/* Right Column: Interactive Session Timeline */}
          <div className="lg:col-span-4">
            <GlassPanel className="h-full flex flex-col max-h-[850px]">
              <div className="p-5 border-b border-white/5 bg-white/[0.02]">
                <h3 className="text-sm font-bold text-white flex items-center gap-2"><FiClock className="text-accent" /> Operations Timeline</h3>
                <p className="text-xs text-slate-400 mt-1">Chronological history of live sessions</p>
              </div>
              <div className="flex-1 overflow-y-auto p-5 scrollbar-hide space-y-6">
                {scheduledMeetings.length === 0 ? (
                  <div className="text-center text-slate-500 text-sm py-10">No sessions recorded yet.</div>
                ) : (
                  <div className="relative pl-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10 space-y-6">
                    {scheduledMeetings.slice().sort((a,b) => new Date(b.date) - new Date(a.date)).map((m, i) => {
                      const dynamicStatus = getDynamicStatus(m);
                      const isPast = new Date(m.date) < new Date();
                      
                      let dotColor = "bg-primary shadow-[0_0_8px_#00f2fe]";
                      if (dynamicStatus === "completed") dotColor = "bg-success shadow-[0_0_8px_#00e676]";
                      if (dynamicStatus === "live") dotColor = "bg-danger shadow-[0_0_8px_#ff1744] animate-pulse";
                      if (dynamicStatus === "cancelled") dotColor = "bg-slate-500";

                      return (
                        <div key={i} className="relative">
                          <div className={`absolute -left-[29px] top-1.5 w-2.5 h-2.5 rounded-full ${dotColor}`} />
                          <div className={`p-4 rounded-xl border transition-all ${isPast ? "bg-white/5 border-white/10 opacity-80 hover:opacity-100" : "bg-primary/5 border-primary/20 shadow-[0_0_15px_rgba(0,242,254,0.05)]"}`}>
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <NeonBadge status={dynamicStatus} />
                                <h4 className="text-sm font-bold text-white mt-1.5 leading-tight">{m.topic}</h4>
                              </div>
                            </div>
                            <p className="text-[10px] text-slate-400 mb-3">{m.courseId?.name}</p>
                            <p className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5 mb-3">
                              <FiCalendar /> {fmtDateTime(m.date)}
                            </p>
                            
                            <div className="flex gap-2">
                              {dynamicStatus !== "completed" && dynamicStatus !== "cancelled" && (
                                <a href={m.zoomLink} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[10px] font-bold bg-primary/10 text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-all">
                                  <FiVideo size={12} /> Join
                                </a>
                              )}
                              {(dynamicStatus === "completed" || isPast) && (
                                <button onClick={() => handleOpenUpload(m)} className="flex items-center gap-1.5 text-[10px] font-bold bg-accent/10 text-accent border border-accent/30 px-3 py-1.5 rounded-lg hover:bg-accent/20 transition-all">
                                  <FiUpload size={12} /> {m.recordingUrl ? "Update Record" : "Upload Video"}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </GlassPanel>
          </div>

        </div>
      </AdminLayout>

      {/* Slide-Over Drawer: Schedule Meeting */}
      <AnimatePresence>
        {isSchedulerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSchedulerOpen(false)} />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-[#0B0F19] border-l border-primary/30 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] h-full flex flex-col z-10"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <h3 className="text-lg font-bold text-white flex items-center gap-2"><FiVideo className="text-primary" /> Schedule Live Session</h3>
                <button onClick={() => setIsSchedulerOpen(false)} className="text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"><FiX size={20} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                <NeonSelect label="Target Course" value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
                  <option value="">-- Choose Course --</option>
                  {uniqueCourses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </NeonSelect>

                {selectedCourse && (
                  <NeonSelect label="Target Batch (Optional)" value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)}>
                    <option value="">All Assigned Students</option>
                    {batches.filter(b => b.courseId?._id === selectedCourse).map(b => (
                      <option key={b._id} value={b._id}>{b.name} ({b.students?.length} students)</option>
                    ))}
                  </NeonSelect>
                )}

                <NeonInput label="Session Topic" value={meetingTopic} onChange={e => setMeetingTopic(e.target.value)} placeholder="e.g. Weekly QA, React Hooks deep dive..." />

                <div className="grid grid-cols-2 gap-4">
                  <NeonInput label="Start Time" type="datetime-local" value={meetingDate} onChange={e => setMeetingDate(e.target.value)} />
                  <NeonInput label="End Time"   type="datetime-local" value={meetingEndDate} onChange={e => setMeetingEndDate(e.target.value)} />
                </div>

                <NeonInput label="Host URL / Zoom Link" value={zoomLink} onChange={e => setZoomLink(e.target.value)} placeholder="https://zoom.us/j/..." />

                {selectedCourse && (
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-3">
                    <FiUsers className="text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-white">Audience Reach</p>
                      <p className="text-[10px] text-slate-400 mt-1">This session will be visible to {enrolledStudents.length} enrolled students in the selected target group.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-white/5 bg-white/[0.01]">
                <NeonButton onClick={handleSchedule} disabled={!selectedCourse || !meetingTopic || !meetingDate || !meetingEndDate || !zoomLink || isScheduling} className="w-full !py-3">
                  {isScheduling ? "Generating Session..." : "Deploy Live Session"}
                </NeonButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Step-Based Upload Wizard Modal */}
      <AnimatePresence>
        {openUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpenUploadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg bg-[#0B0F19] border border-accent/30 rounded-2xl shadow-[0_0_50px_rgba(139,92,246,0.15)] overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
              
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <h3 className="text-base font-bold text-white flex items-center gap-2"><FiUpload className="text-accent" /> Session Wrap-up Wizard</h3>
                <button onClick={() => setOpenUploadModal(false)} className="text-slate-400 hover:text-white transition-colors"><FiX size={20} /></button>
              </div>

              <div className="p-6">
                {/* Wizard Steps indicator */}
                <div className="flex gap-2 mb-6">
                  <div className={`h-1.5 flex-1 rounded-full ${uploadStep >= 1 ? "bg-accent shadow-[0_0_10px_#8b5cf6]" : "bg-white/10"}`} />
                  <div className={`h-1.5 flex-1 rounded-full ${uploadStep >= 2 ? "bg-accent shadow-[0_0_10px_#8b5cf6]" : "bg-white/10"}`} />
                </div>

                <div className="mb-6">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Target Session</p>
                  <p className="text-sm font-bold text-white">{selectedMeeting?.topic}</p>
                </div>

                {uploadStep === 1 ? (
                  <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
                    <NeonInput 
                      label="Step 1: Provide Recording Link" 
                      value={recordingUrl} 
                      onChange={e => setRecordingUrl(e.target.value)} 
                      placeholder="Google Drive, Zoom Cloud, YouTube unlisted..." 
                    />
                    <div className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-start gap-3">
                      <FiPlayCircle className="text-slate-400 mt-0.5" />
                      <p className="text-[10px] text-slate-400">Providing a link allows students who missed the live session to catch up. This will permanently mark the session as Completed.</p>
                    </div>
                    <div className="flex justify-end mt-6">
                      <NeonButton variant="secondary" onClick={() => setUploadStep(2)} disabled={!recordingUrl}>Next Step <FiChevronRight /></NeonButton>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Step 2: Attach Class Notes (Optional)</p>
                      <input type="file" accept="application/pdf" id="material-upload" className="hidden" onChange={handleFileChange} />
                      <label
                        htmlFor="material-upload"
                        className="flex flex-col items-center justify-center gap-2 w-full p-8 bg-white/5 border border-dashed border-white/20 text-slate-400 rounded-xl text-sm font-medium cursor-pointer hover:border-accent/50 hover:bg-accent/5 hover:text-accent transition-all group"
                      >
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent/20 group-hover:text-accent transition-all text-xl mb-2"><FiUpload /></div>
                        {materialName ? <span className="text-white font-bold">{materialName}</span> : <span>Click to browse PDF files</span>}
                      </label>
                    </div>
                    <div className="flex justify-between mt-6">
                      <NeonButton variant="ghost" onClick={() => setUploadStep(1)}>Back</NeonButton>
                      <NeonButton variant="success" onClick={handleUploadSubmit} disabled={isUploading}>
                        {isUploading ? "Finalizing..." : <><FiCheckCircle /> Complete Wrap-up</>}
                      </NeonButton>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
};

export default StaffMeetingsPage;
