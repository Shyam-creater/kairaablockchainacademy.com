import React, { useState, useMemo } from "react";
import Heading from "../../components/Heading";
import AdminLayout from "../../components/Admin/AdminLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetAttendanceDashboardQuery, useSendAttendanceReminderMutation,
  useGetAllSessionsQuery, useGetStudentAttendanceStatsQuery,
  useMarkAttendanceManuallyMutation, useGetStaffAssignedCoursesQuery,
} from "../../redux/features/staff/staffApi";
import toast from "react-hot-toast";
import {
  FaUserCheck, FaUserTimes, FaCalendarAlt, FaEnvelope,
  FaExclamationTriangle, FaChevronDown, FaChevronUp, FaClock, FaTrophy,
} from "react-icons/fa";
import {
  FiX, FiActivity, FiUsers, FiTrendingUp, FiList, FiBarChart2,
  FiFilter, FiCheckCircle, FiAlertCircle, FiAlertTriangle,
} from "react-icons/fi";

// â”€â”€ Neon Primitives â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const GlassPanel = ({ children, className = "", glow = "" }) => (
  <div className={`bg-surface/40 backdrop-blur-xl border border-white/10 rounded-2xl relative overflow-hidden ${glow} ${className}`}>
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    {children}
  </div>
);

const NeonButton = ({ children, onClick, disabled, variant = "primary", size = "md", className = "" }) => {
  const vMap = {
    primary: "bg-primary/10 border-primary/50 text-primary hover:bg-primary/20 hover:shadow-[0_0_20px_rgba(0,242,254,0.3)]",
    danger:  "bg-danger/10  border-danger/50  text-danger  hover:bg-danger/20",
    warning: "bg-warning/10 border-warning/50 text-warning hover:bg-warning/20",
    ghost:   "bg-white/5    border-white/10   text-slate-300 hover:bg-white/10",
    success: "bg-success/10 border-success/50 text-success hover:bg-success/20",
  };
  const sMap = { sm: "px-3 py-1.5 text-xs", md: "px-5 py-2.5 text-sm" };
  return (
    <button onClick={onClick} disabled={disabled}
      className={`flex items-center justify-center gap-2 rounded-xl font-bold border transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${vMap[variant]} ${sMap[size]} ${className}`}>
      {children}
    </button>
  );
};

const RiskBadge = ({ status }) => {
  const map = {
    "on-track": { label: "On Track", cls: "bg-success/10 text-success border-success/30", icon: <FiCheckCircle size={10} /> },
    "at-risk":  { label: "At Risk",  cls: "bg-warning/10 text-warning border-warning/30", icon: <FiAlertCircle size={10} /> },
    critical:   { label: "Critical", cls: "bg-danger/10  text-danger  border-danger/30",  icon: <FiAlertTriangle size={10} /> },
  };
  const { label, cls, icon } = map[status] || map["on-track"];
  return (
    <span className={`flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${cls}`}>
      {icon} {label}
    </span>
  );
};

const CircularProgress = ({ value, max = 100, label, sub, colorClass, hexColor, formatStr = "" }) => {
  const pct = Math.min((Number(value) / (Number(max) || 1)) * 100, 100);
  const radius = 28, circ = 2 * Math.PI * radius, offset = circ - (pct / 100) * circ;
  return (
    <GlassPanel className="p-4 flex items-center gap-4 hover:-translate-y-1 transition-all duration-300">
      <div className="relative w-16 h-16 flex-shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="none" />
          <circle cx="32" cy="32" r={radius} stroke={hexColor} strokeWidth="6" fill="none"
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease", filter: `drop-shadow(0 0 4px ${hexColor}99)` }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-sm font-extrabold ${colorClass} leading-none`}>{value}{formatStr}</span>
        </div>
      </div>
      <div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-[10px] text-slate-500 font-medium">{sub}</p>
      </div>
    </GlassPanel>
  );
};

// â”€â”€ Real 30-Day Heatmap â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const AttendanceHeatmap = ({ sessions }) => {
  const today = new Date();
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today); d.setDate(today.getDate() - (29 - i)); return d;
  });
  const rateByDay = useMemo(() => {
    const map = {};
    (sessions || []).forEach(s => {
      const k = new Date(s.meeting.date).toDateString();
      map[k] = s.totalCount > 0 ? s.presentCount / s.totalCount : 0;
    });
    return map;
  }, [sessions]);
  const getColor = r =>
    r === undefined ? "bg-white/5" : r >= 0.9 ? "bg-success shadow-[0_0_5px_rgba(0,230,118,0.6)]"
    : r >= 0.75 ? "bg-success/60" : r >= 0.5 ? "bg-warning/50" : r > 0 ? "bg-danger/40" : "bg-danger/20";
  return (
    <GlassPanel className="p-4 flex flex-col gap-2 bg-surface/20" style={{ minHeight: 152 }}>
      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <FiTrendingUp className="inline mr-1" /> 30-Day Attendance Heatmap
      </h3>
      <div className="flex flex-wrap gap-1">
        {days.map((d, i) => {
          const r = rateByDay[d.toDateString()];
          return <div key={i} className={`w-3 h-3 rounded-sm ${getColor(r)} transition-all hover:scale-150 cursor-pointer`}
            title={`${d.toLocaleDateString()} - ${r !== undefined ? Math.round(r * 100) + "%" : "No session"}`} />;
        })}
      </div>
      <div className="flex gap-3">
        {[{ cls: "bg-success", l: ">=90%" }, { cls: "bg-success/60", l: ">=75%" }, { cls: "bg-warning/50", l: ">=50%" }, { cls: "bg-danger/40", l: "<50%" }, { cls: "bg-white/5", l: "None" }]
          .map(x => <div key={x.l} className="flex items-center gap-1"><div className={`w-2 h-2 rounded-sm ${x.cls}`} /><span className="text-[8px] text-slate-500">{x.l}</span></div>)}
      </div>
    </GlassPanel>
  );
};

// â”€â”€ Tab 1: Dashboard Overview â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const DashboardTab = ({ stats, todaysSessions, allSessions, studentStats }) => {
  const topAttendee = useMemo(() =>
    !studentStats?.length ? null : [...studentStats].sort((a, b) => b.rate - a.rate)[0],
    [studentStats]);
  const criticalCount = (studentStats || []).filter(s => s.riskStatus === "critical").length;
  const atRiskCount   = (studentStats || []).filter(s => s.riskStatus === "at-risk").length;
  return (
    <div className="space-y-6">
      {/* Stat row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <CircularProgress value={stats.totalSessions} max={100} label="Total Sessions" sub="Classes hosted" colorClass="text-primary" hexColor="#00f2fe" />
        <CircularProgress value={stats.overallRate} max={100} formatStr="%" label="Overall Attendance" sub="Health metric"
          colorClass={stats.overallRate > 75 ? "text-success" : stats.overallRate > 50 ? "text-warning" : "text-danger"}
          hexColor={stats.overallRate > 75 ? "#00e676" : stats.overallRate > 50 ? "#ffb300" : "#ff1744"} />
        {/* Top Attendee - real data */}
        <GlassPanel className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent text-xl shadow-[0_0_15px_rgba(139,92,246,0.3)]">
            <FaTrophy />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Top Attendee</p>
            {topAttendee
              ? <><p className="text-sm font-extrabold text-white truncate max-w-[120px]">{topAttendee.student?.name || "---"}</p><p className="text-[10px] text-slate-500">{topAttendee.rate}% Rate</p></>
              : <p className="text-sm text-slate-500">No data yet</p>}
          </div>
        </GlassPanel>
        {/* Risk panel - real data */}
        <GlassPanel className="p-4 flex items-center gap-4 bg-danger/5 border-danger/20">
          <div className="w-12 h-12 rounded-xl bg-danger/20 border border-danger/40 flex items-center justify-center text-danger text-xl shadow-[0_0_15px_rgba(255,23,68,0.3)]">
            <FaExclamationTriangle />
          </div>
          <div>
            <p className="text-[10px] font-bold text-danger uppercase tracking-widest mb-1">Risk Warning</p>
            <p className="text-sm font-extrabold text-white">{criticalCount + atRiskCount} Students</p>
            <p className="text-[10px] text-slate-500">{criticalCount} critical Â· {atRiskCount} at-risk</p>
          </div>
        </GlassPanel>
      </div>
      {/* Split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 flex flex-col gap-5">
          <GlassPanel className="flex flex-col overflow-hidden" style={{ minHeight: 300, maxHeight: 360 }}>
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2"><FiActivity className="text-primary" /> Today&apos;s Sessions</h3>
              <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full border border-primary/30">{todaysSessions.length} Live</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
              {todaysSessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center opacity-60 py-10">
                  <FaCalendarAlt className="text-4xl text-slate-500 mb-3" />
                  <p className="text-sm text-slate-400">No sessions today.</p>
                </div>
              ) : todaysSessions.map((s, i) => {
                const t = (s.presentCount + s.absentCount) || 1;
                const p = Math.round((s.presentCount / t) * 100);
                return (
                  <div key={i} className="rounded-xl border p-3 bg-white/5 border-white/10 hover:border-primary/30 transition-all">
                    <p className="text-sm font-bold text-white mb-0.5 truncate">{s.meeting.title || s.meeting.topic}</p>
                    <p className="text-[10px] text-slate-400 mb-3 truncate">{s.meeting.courseId?.name}</p>
                    <div className="flex justify-between text-[10px] font-bold mb-1">
                      <span className="text-success">{s.presentCount} Present</span>
                      <span className="text-danger">{s.absentCount} Absent</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden flex">
                      <div className="h-full bg-success shadow-[0_0_6px_rgba(0,230,118,0.5)]" style={{ width: `${p}%` }} />
                      <div className="h-full bg-danger shadow-[0_0_6px_rgba(255,23,68,0.5)]" style={{ width: `${100 - p}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassPanel>
          {/* Real heatmap */}
          <AttendanceHeatmap sessions={allSessions} />
        </div>
        <div className="lg:col-span-8">
          <GlassPanel className="h-full flex flex-col items-center justify-center text-center opacity-50" style={{ minHeight: 420 }}>
            <FiActivity className="text-5xl text-primary mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Session Roster</h2>
            <p className="text-sm text-slate-400 max-w-xs">
              Switch to the <strong className="text-primary">Sessions</strong> tab for full history with manual attendance controls,
              or <strong className="text-primary">Student Tracker</strong> for per-student rates.
            </p>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
};

// â”€â”€ Expandable Session Row â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const SessionRow = ({ session, onRemind, onMarkAttendance, isMarking }) => {
  const [open, setOpen] = useState(false);
  const pct = session.totalCount > 0 ? Math.round((session.presentCount / session.totalCount) * 100) : 0;
  const isPast = new Date(session.meeting.date) < new Date();
  const cId = session.meeting.courseId?._id || session.meeting.courseId;
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden bg-surface/20">
      <div onClick={() => setOpen(o => !o)} className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors group">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">
              {session.meeting.title || session.meeting.topic}
            </p>
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${isPast ? "bg-slate-700/50 text-slate-400 border-slate-600/30" : "bg-primary/10 text-primary border-primary/30"}`}>
              {isPast ? "Past" : "Upcoming"}
            </span>
          </div>
          <p className="text-[10px] text-slate-400">
            {session.meeting.courseId?.name || "â€”"} &middot; {new Date(session.meeting.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-4 ml-4">
          <div className="hidden sm:flex flex-col items-end gap-1">
            <span className="text-[10px] font-bold text-white">{pct}%</span>
            <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${pct >= 75 ? "bg-success" : pct >= 50 ? "bg-warning" : "bg-danger"}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
          <div className="flex gap-3 text-[10px] font-bold">
            <span className="text-success flex items-center gap-1"><FaUserCheck size={10} />{session.presentCount}</span>
            <span className="text-danger flex items-center gap-1"><FaUserTimes size={10} />{session.absentCount}</span>
          </div>
          <span className="text-slate-500">{open ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}</span>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="p-4 border-t border-white/5">
              {session.presentStudents.length === 0 && session.absentStudents.length === 0 ? (
                <p className="text-center text-sm text-slate-500 py-4">No enrolled students found.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Present students */}
                  {session.presentStudents.map(st => (
                    <div key={st._id} className="flex items-center justify-between p-3 rounded-xl bg-success/5 border border-success/20 group">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-success/20 border border-success/40 flex items-center justify-center text-success font-bold">
                          {st.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{st.name}</p>
                          <p className="text-[10px] text-slate-400">{st.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${st.attendanceStatus === "late" ? "bg-warning/10 text-warning border-warning/30" : "bg-success/10 text-success border-success/30"}`}>
                          {st.attendanceStatus === "late" ? "Late" : "Present"}
                        </span>
                        <NeonButton size="sm" variant="danger" className="opacity-0 group-hover:opacity-100 transition-opacity" disabled={isMarking}
                          onClick={() => onMarkAttendance({ meetingId: session.meeting._id, studentId: st._id, courseId: cId, status: "absent" })}>
                          <FaUserTimes size={10} />
                        </NeonButton>
                      </div>
                    </div>
                  ))}
                  {/* Absent students */}
                  {session.absentStudents.map(st => (
                    <div key={st._id} className="flex items-center justify-between p-3 rounded-xl bg-danger/5 border border-danger/20 group">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-danger/20 border border-danger/40 flex items-center justify-center text-danger font-bold">
                          {st.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{st.name}</p>
                          <p className="text-[10px] text-slate-400">{st.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border bg-danger/10 text-danger border-danger/30">Absent</span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <NeonButton size="sm" variant="success" disabled={isMarking}
                            onClick={() => onMarkAttendance({ meetingId: session.meeting._id, studentId: st._id, courseId: cId, status: "present" })}>
                            <FaUserCheck size={10} />
                          </NeonButton>
                          <NeonButton size="sm" variant="warning" disabled={isMarking}
                            onClick={() => onMarkAttendance({ meetingId: session.meeting._id, studentId: st._id, courseId: cId, status: "late" })}>
                            <FaClock size={10} />
                          </NeonButton>
                          <NeonButton size="sm" variant="danger" disabled={isMarking}
                            onClick={() => onRemind(st, session.meeting)}>
                            <FaEnvelope size={10} />
                          </NeonButton>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// â”€â”€ Tab 2: Session History â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const SessionsTab = ({ sessions, isLoading, courses, onRemind, onMarkAttendance, isMarking }) => {
  const [filterCourse, setFilterCourse] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const filtered = useMemo(() => (sessions || []).filter(s => {
    const mc = !filterCourse || String(s.meeting.courseId?._id || s.meeting.courseId) === filterCourse;
    const ip = new Date(s.meeting.date) < new Date();
    const ms = filterStatus === "all" || (filterStatus === "past" && ip) || (filterStatus === "upcoming" && !ip);
    return mc && ms;
  }), [sessions, filterCourse, filterStatus]);
  return (
    <div className="space-y-5">
      <GlassPanel className="p-4 flex flex-wrap gap-4 items-center">
        <FiFilter className="text-slate-400" />
        <select value={filterCourse} onChange={e => setFilterCourse(e.target.value)}
          className="bg-surface border border-white/10 text-white text-xs rounded-lg px-3 py-2 outline-none focus:border-primary/50 transition-colors">
          <option value="">All Courses</option>
          {(courses || []).map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <div className="flex gap-2">
          {["all", "past", "upcoming"].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all capitalize ${filterStatus === s ? "bg-primary/20 border-primary/50 text-primary" : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"}`}>
              {s}
            </button>
          ))}
        </div>
        <span className="ml-auto text-[10px] text-slate-500 font-bold">{filtered.length} sessions</span>
      </GlassPanel>
      {isLoading ? (
        <div className="flex justify-center py-16"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <GlassPanel className="p-16 flex flex-col items-center justify-center opacity-60">
          <FaCalendarAlt className="text-4xl text-slate-500 mb-3" />
          <p className="text-sm text-slate-400">No sessions found for this filter.</p>
        </GlassPanel>
      ) : (
        <div className="space-y-3">
          {filtered.map((s, i) => (
            <SessionRow key={i} session={s} onRemind={onRemind} onMarkAttendance={onMarkAttendance} isMarking={isMarking} />
          ))}
        </div>
      )}
    </div>
  );
};

// â”€â”€ Tab 3: Student Tracker â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const StudentTrackerTab = ({ studentStats, isLoading, onRemind }) => {
  const [search, setSearch] = useState("");
  const [filterRisk, setFilterRisk] = useState("all");
  const filtered = useMemo(() => (studentStats || []).filter(s => {
    const ms = !search || s.student?.name?.toLowerCase().includes(search.toLowerCase()) || s.student?.email?.toLowerCase().includes(search.toLowerCase());
    return ms && (filterRisk === "all" || s.riskStatus === filterRisk);
  }), [studentStats, search, filterRisk]);

  if (isLoading) return <div className="flex justify-center py-16"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-5">
      {/* Controls */}
      <GlassPanel className="p-4 flex flex-wrap gap-4 items-center">
        <FiUsers className="text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
          className="bg-surface border border-white/10 text-white text-xs rounded-lg px-3 py-2 outline-none focus:border-primary/50 w-56 placeholder-slate-500" />
        <div className="flex gap-2 flex-wrap">
          {["all", "on-track", "at-risk", "critical"].map(r => (
            <button key={r} onClick={() => setFilterRisk(r)}
              className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all capitalize ${
                filterRisk === r
                  ? r === "critical" ? "bg-danger/20 border-danger/50 text-danger"
                  : r === "at-risk"  ? "bg-warning/20 border-warning/50 text-warning"
                  : r === "on-track" ? "bg-success/20 border-success/50 text-success"
                  : "bg-primary/20 border-primary/50 text-primary"
                  : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
              }`}>
              {r === "all" ? "All" : r.replace("-", " ")}
            </button>
          ))}
        </div>
        <span className="ml-auto text-[10px] text-slate-500 font-bold">{filtered.length} students</span>
      </GlassPanel>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "On Track", count: (studentStats || []).filter(s => s.riskStatus === "on-track").length, color: "text-success", bg: "bg-success/10 border-success/20" },
          { label: "At Risk",  count: (studentStats || []).filter(s => s.riskStatus === "at-risk").length,  color: "text-warning", bg: "bg-warning/10 border-warning/20" },
          { label: "Critical", count: (studentStats || []).filter(s => s.riskStatus === "critical").length, color: "text-danger",  bg: "bg-danger/10  border-danger/20"  },
        ].map(item => (
          <GlassPanel key={item.label} className={`p-4 text-center ${item.bg}`}>
            <p className={`text-2xl font-extrabold ${item.color}`}>{item.count}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{item.label}</p>
          </GlassPanel>
        ))}
      </div>

      {/* Student cards */}
      {filtered.length === 0 ? (
        <GlassPanel className="p-16 flex flex-col items-center justify-center opacity-60">
          <FiUsers className="text-4xl text-slate-500 mb-3" />
          <p className="text-sm text-slate-400">No students match this filter.</p>
        </GlassPanel>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((item, idx) => (
            <motion.div key={item.student?._id || idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}>
              <GlassPanel className={`p-5 flex flex-col gap-4 hover:-translate-y-1 transition-all duration-300 ${
                item.riskStatus === "critical" ? "border-danger/20 bg-danger/5" :
                item.riskStatus === "at-risk"  ? "border-warning/20 bg-warning/5" : ""
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold border ${
                      item.riskStatus === "critical" ? "bg-danger/20 border-danger/40 text-danger" :
                      item.riskStatus === "at-risk"  ? "bg-warning/20 border-warning/40 text-warning" :
                      "bg-success/20 border-success/40 text-success"
                    }`}>
                      {item.student?.name?.charAt(0) || "?"}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{item.student?.name || "Unknown"}</p>
                      <p className="text-[10px] text-slate-400 truncate max-w-[130px]">{item.student?.email}</p>
                    </div>
                  </div>
                  <RiskBadge status={item.riskStatus} />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Attendance Rate</span>
                    <span className={`text-sm font-extrabold ${
                      item.riskStatus === "critical" ? "text-danger" : item.riskStatus === "at-risk" ? "text-warning" : "text-success"
                    }`}>{item.rate}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-1000 ${
                      item.riskStatus === "critical" ? "bg-danger shadow-[0_0_8px_rgba(255,23,68,0.5)]" :
                      item.riskStatus === "at-risk"  ? "bg-warning shadow-[0_0_8px_rgba(255,179,0,0.5)]" :
                      "bg-success shadow-[0_0_8px_rgba(0,230,118,0.5)]"
                    }`} style={{ width: `${item.rate}%` }} />
                  </div>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-white/5">
                  <span className="text-[10px] text-slate-400">
                    <span className="font-bold text-white">{item.attended}</span> / {item.totalSessions} sessions
                  </span>
                  {item.riskStatus !== "on-track" && (
                    <NeonButton size="sm" variant={item.riskStatus === "critical" ? "danger" : "warning"}
                      onClick={() => onRemind(item.student, null)}>
                      <FaEnvelope size={10} /> Remind
                    </NeonButton>
                  )}
                </div>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// â”€â”€ Main Page Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const StaffAttendancePage = () => {
  // API hooks â€” connecting to real backend endpoints
  const { data: dashData,     isLoading: dashLoading }     = useGetAttendanceDashboardQuery();
  const { data: sessionsData, isLoading: sessionsLoading } = useGetAllSessionsQuery(undefined, { refetchOnMountOrArgChange: true });
  const { data: statsData,    isLoading: statsLoading }    = useGetStudentAttendanceStatsQuery();
  const { data: coursesData }                              = useGetStaffAssignedCoursesQuery();
  const [sendReminder, { isLoading: isSending }]           = useSendAttendanceReminderMutation();
  const [markAttendance, { isLoading: isMarking }]         = useMarkAttendanceManuallyMutation();

  const [activeTab, setActiveTab]             = useState("dashboard");
  const [reminderOpen, setReminderOpen]       = useState(false);
  const [reminderStudent, setReminderStudent] = useState(null);
  const [reminderMsg, setReminderMsg]         = useState("");

  // Derived data with safe defaults
  const stats          = dashData?.stats          || { totalSessions: 0, overallRate: 0 };
  const todaysSessions = dashData?.todaysSessions || [];
  const allSessions    = sessionsData?.sessions   || [];
  const studentStats   = statsData?.stats         || [];
  const courses        = coursesData?.assignedCourses || [];

  const openReminder = (student, meeting) => {
    setReminderStudent(student);
    const name = meeting?.title || meeting?.topic || "a recent class";
    setReminderMsg(`Hi ${student?.name?.split(" ")[0] || "Student"}, you missed ${name}. Please watch the recording and attend the next session.`);
    setReminderOpen(true);
  };

  const handleSendReminder = async () => {
    if (!reminderMsg.trim()) return;
    try {
      await sendReminder({ studentId: reminderStudent._id, message: reminderMsg }).unwrap();
      toast.success("Reminder sent successfully");
      setReminderOpen(false); setReminderStudent(null); setReminderMsg("");
    } catch (e) {
      toast.error(e?.data?.message || "Failed to send reminder");
    }
  };

  const handleMarkAttendance = async ({ meetingId, studentId, courseId, status }) => {
    try {
      await markAttendance({ meetingId, studentId, courseId, status }).unwrap();
      toast.success(`Marked as ${status}`);
    } catch (e) {
      toast.error(e?.data?.message || "Failed to mark attendance");
    }
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard",       icon: <FiBarChart2 size={14} /> },
    { id: "sessions",  label: "Sessions",        icon: <FiList size={14} /> },
    { id: "tracker",   label: "Student Tracker", icon: <FiUsers size={14} /> },
  ];
  const atRiskCount    = studentStats.filter(s => s.riskStatus !== "on-track").length;
  const isPageLoading  = dashLoading && sessionsLoading && statsLoading;

  return (
    <>
      <Heading title="Attendance Command Center" description="Premium SaaS Analytics for Live Class Attendance Tracking" keywords="staff,attendance" />
      <AdminLayout title="Attendance Command Center" subtitle="Real-time class roster and risk analytics">
        {isPageLoading ? (
          <div className="flex justify-center items-center h-[50vh]">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Tab nav */}
            <div className="flex items-center gap-1 border-b border-white/10">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all -mb-px ${
                    activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-slate-400 hover:text-white hover:border-white/20"
                  }`}>
                  {tab.icon} {tab.label}
                  {tab.id === "tracker" && atRiskCount > 0 && (
                    <span className="ml-1 bg-danger/20 border border-danger/40 text-danger text-[9px] font-bold px-1.5 py-0.5 rounded-full">{atRiskCount}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              {activeTab === "dashboard" && (
                <motion.div key="dashboard" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <DashboardTab stats={stats} todaysSessions={todaysSessions} allSessions={allSessions} studentStats={studentStats} />
                </motion.div>
              )}
              {activeTab === "sessions" && (
                <motion.div key="sessions" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <SessionsTab sessions={allSessions} isLoading={sessionsLoading} courses={courses}
                    onRemind={openReminder} onMarkAttendance={handleMarkAttendance} isMarking={isMarking} />
                </motion.div>
              )}
              {activeTab === "tracker" && (
                <motion.div key="tracker" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <StudentTrackerTab studentStats={studentStats} isLoading={statsLoading} onRemind={openReminder} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </AdminLayout>

      {/* Reminder modal */}
      <AnimatePresence>
        {reminderOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setReminderOpen(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg bg-[#0B0F19] border border-primary/30 rounded-2xl shadow-[0_0_50px_rgba(0,242,254,0.15)] overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary"><FaEnvelope size={14} /></div>
                  <div>
                    <h3 className="text-base font-bold text-white">Issue Attendance Warning</h3>
                    {reminderStudent && <p className="text-[10px] text-slate-400">To: {reminderStudent.name}</p>}
                  </div>
                </div>
                <button onClick={() => setReminderOpen(false)} className="text-slate-400 hover:text-white transition-colors"><FiX size={20} /></button>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Quick Templates</p>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setReminderMsg("You missed today's class. Please watch the recording when posted.")}
                      className="text-[9px] bg-white/5 hover:bg-white/10 text-slate-300 px-3 py-1.5 rounded-lg border border-white/10 transition-colors">Standard</button>
                    <button onClick={() => setReminderMsg("Warning: Attendance below 75%. This may affect your certificate eligibility.")}
                      className="text-[9px] bg-warning/10 hover:bg-warning/20 text-warning px-3 py-1.5 rounded-lg border border-warning/30 transition-colors">75% Warning</button>
                    <button onClick={() => setReminderMsg("Critical: Attendance below 50%. You are at risk of suspension. Contact us immediately.")}
                      className="text-[9px] bg-danger/10 hover:bg-danger/20 text-danger px-3 py-1.5 rounded-lg border border-danger/30 transition-colors">Critical Warning</button>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Message</p>
                  <textarea value={reminderMsg} onChange={e => setReminderMsg(e.target.value)} rows={4}
                    placeholder="Type a custom warning or use a template above..."
                    className="bg-surface border border-slate-600 text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(0,242,254,0.2)] transition-all placeholder-slate-500 w-full resize-none" />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <NeonButton variant="ghost" onClick={() => setReminderOpen(false)}>Cancel</NeonButton>
                  <NeonButton variant="primary" onClick={handleSendReminder} disabled={isSending || !reminderMsg.trim()}>
                    {isSending ? "Dispatching..." : "Send Warning"}
                  </NeonButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default StaffAttendancePage;

