import React, { useState } from "react";
import Heading from "../components/Heading";
import AdminLayout from "../components/Admin/AdminLayout";
import { motion, AnimatePresence } from "framer-motion";
import { useGetStudentsProgressQuery, useRecommendCertificateMutation } from "../redux/features/staff/staffApi";
import { FiRefreshCw, FiAlertTriangle, FiAward, FiUsers, FiCheckCircle, FiX, FiActivity, FiTrendingUp } from "react-icons/fi";
import { format } from "timeago.js";
import toast from "react-hot-toast";
import { 
  DataGrid, 
  GridToolbarContainer, 
  GridToolbarColumnsButton, 
  GridToolbarFilterButton, 
  GridToolbarDensitySelector, 
  GridToolbarExport 
} from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";

// ── Reusable Neon UI Primitives ───────────────────────────────────────────────

const GlassPanel = ({ children, className = "", glow = "" }) => (
  <div
    className={`bg-surface/40 backdrop-blur-xl border border-white/10 rounded-2xl relative overflow-hidden ${glow} ${className}`}
  >
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    {children}
  </div>
);

const StatCircleCard = ({ label, value, max, sub, glow, delay, displayValue }) => {
  const val = Number(value) || 0;
  const m = Number(max) || 1;
  const pct = Math.min((val / (m === 0 ? 1 : m)) * 100, 100);

  const radius = 24;
  const circ   = 2 * Math.PI * radius;
  const offset = circ - (pct / 100) * circ;

  const hex =
    pct >= 100 ? "#00e676" :
    pct >= 60  ? "#00f2fe" :
    pct >= 30  ? "#ffb300" :
                 "#ff1744";

  const textColor =
    pct >= 100 ? "text-success" :
    pct >= 60  ? "text-primary"  :
    pct >= 30  ? "text-warning"  :
                 "text-danger";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay }}
    >
      <GlassPanel glow={glow} className="p-5 flex items-center gap-4 hover:-translate-y-1 transition-all duration-300 group">
        <div className="relative w-16 h-16 flex-shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r={radius} stroke="rgba(255,255,255,0.06)" strokeWidth="5" fill="none" />
            <circle
              cx="30" cy="30" r={radius}
              stroke={hex}
              strokeWidth="5"
              fill="none"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{
                transition: "stroke-dashoffset 1s ease",
                filter: `drop-shadow(0 0 4px ${hex}99)`,
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
             <span className={`text-[13px] font-extrabold ${textColor} leading-none`}>{displayValue || value}</span>
          </div>
        </div>
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
          <p className="text-[11px] text-slate-500">{sub}</p>
        </div>
      </GlassPanel>
    </motion.div>
  );
};

const NeonBadge = ({ value, colorClass, borderClass, bgClass, label }) => (
  <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${bgClass} ${colorClass} ${borderClass}`}>
    {label || value}
  </span>
);

const CircularProgress = ({ value }) => {
  const pct    = Math.min(Number(value) || 0, 100);
  const radius = 22;
  const circ   = 2 * Math.PI * radius;
  const offset = circ - (pct / 100) * circ;

  const hex =
    pct >= 100 ? "#00e676" :
    pct >= 60  ? "#00f2fe" :
    pct >= 30  ? "#ffb300" :
                 "#ff1744";

  const textColor =
    pct >= 100 ? "text-success" :
    pct >= 60  ? "text-primary"  :
    pct >= 30  ? "text-warning"  :
                 "text-danger";

  return (
    <div className="flex items-center justify-start">
      <div className="relative w-14 h-14 flex-shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
          {/* Track */}
          <circle
            cx="28" cy="28" r={radius}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="5"
            fill="none"
          />
          {/* Progress arc */}
          <circle
            cx="28" cy="28" r={radius}
            stroke={hex}
            strokeWidth="5"
            fill="none"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 0.8s ease",
              filter: `drop-shadow(0 0 4px ${hex}99)`,
            }}
          />
        </svg>
        {/* Centered % text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-[10px] font-extrabold leading-none ${textColor}`}>{pct}%</span>
        </div>
      </div>
    </div>
  );
};


// ── Main Component ────────────────────────────────────────────────────────────

const StaffDashboardPage = () => {
  const { data, isLoading, refetch } = useGetStudentsProgressQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [recommendCert, { isLoading: isRecommending }] = useRecommendCertificateMutation();

  const students = data?.studentsProgress || [];
  const studentsNeedingFollowUp = students.filter(s => s.needsFollowUp);
  const completedStudents = students.filter(s => s.progress >= 100);

  const [openRecommendModal, setOpenRecommendModal] = useState(false);
  const [selectedStudent, setSelectedStudent]       = useState(null);
  const [notes, setNotes]                           = useState("");
  const [filterModel, setFilterModel]               = useState({ items: [] });

  const handleRecommendClick = (student) => {
    setSelectedStudent(student);
    setOpenRecommendModal(true);
  };

  const handleRecommendSubmit = async () => {
    try {
      await recommendCert({
        studentId: selectedStudent.student._id,
        courseId:  selectedStudent.course._id,
        notes,
      }).unwrap();
      toast.success("Student recommended for certificate!");
      setOpenRecommendModal(false);
      setNotes("");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to recommend");
    }
  };

  // Map Data to DataGrid rows
  const rows = students.map((s, index) => ({
    id: s.student?._id || index,
    studentName: s.student?.name || "N/A",
    courseName: s.course?.name || "N/A",
    progress: s.progress || 0,
    quizAverage: s.quizAverage || 0,
    assignmentStatus: s.assignmentStatus || "—",
    lastActive: s.lastLogin ? format(s.lastLogin) : "Never",
    needsFollowUp: s.needsFollowUp,
    rawStudent: s
  }));

  const columns = [
    { field: "studentName", headerName: "Student", flex: 1, minWidth: 150, 
      renderCell: (params) => (
        <div className="flex items-center gap-3 h-full">
          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
            {params.row.studentName?.charAt(0) || "?"}
          </div>
          <div>
            <p className="text-sm font-semibold text-white whitespace-nowrap">{params.row.studentName}</p>
            {params.row.needsFollowUp && (
              <span className="text-[10px] text-danger font-bold flex items-center gap-1 mt-0.5">
                <FiAlertTriangle size={10} /> Follow-Up Needed
              </span>
            )}
          </div>
        </div>
      )
    },
    { field: "courseName", headerName: "Course", flex: 1, minWidth: 160, 
      renderCell: (params) => <p className="text-sm text-slate-300 truncate">{params.row.courseName}</p>
    },
    { field: "progress", headerName: "Progress", flex: 0.8, minWidth: 120, 
      renderCell: (params) => <CircularProgress value={params.row.progress} />
    },
    { field: "quizAverage", headerName: "Quiz Avg", flex: 0.6, minWidth: 100,
      renderCell: (params) => (
        <span className={`text-sm font-bold ${
            (params.row.quizAverage || 0) >= 70 ? "text-success" :
            (params.row.quizAverage || 0) >= 40 ? "text-warning" : "text-danger"
          }`}
        >
          {params.row.quizAverage ?? 0}%
        </span>
      )
    },
    { field: "assignmentStatus", headerName: "Assignments", flex: 0.8, minWidth: 130, 
      renderCell: (params) => <p className="text-sm text-slate-300">{params.row.assignmentStatus}</p>
    },
    { field: "lastActive", headerName: "Last Active", flex: 0.8, minWidth: 120, 
      renderCell: (params) => <p className="text-sm text-slate-400">{params.row.lastActive}</p>
    },
    { field: "action", headerName: "Action", flex: 1, minWidth: 140, 
      renderCell: (params) => {
        const s = params.row.rawStudent;
        if (s.progress >= 100) {
          if (s.recommendationStatus) {
            return <NeonBadge label={s.recommendationStatus.toUpperCase()} colorClass="text-primary" bgClass="bg-primary/10" borderClass="border-primary/30" />
          } else {
            return (
              <button
                onClick={() => handleRecommendClick(s)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-success/10 border border-success/30 text-success rounded-xl text-xs font-bold hover:bg-success/20 hover:shadow-[0_0_12px_rgba(0,230,118,0.3)] transition-all whitespace-nowrap"
              >
                <FiAward size={11} /> Recommend
              </button>
            )
          }
        } else {
          return <NeonBadge label="In Progress" colorClass="text-slate-400" bgClass="bg-white/5" borderClass="border-white/10" />
        }
      }
    }
  ];

  const CustomToolbar = () => (
    <GridToolbarContainer sx={{ display: 'flex', justifyContent: 'space-between', padding: 2, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <Box sx={{ display: 'flex', gap: 3 }}>
        <GridToolbarColumnsButton sx={{ color: '#94A3B8', fontWeight: '500', '&:hover': { color: '#E2E8F0' } }} />
        <GridToolbarFilterButton sx={{ color: '#94A3B8', fontWeight: '500', '&:hover': { color: '#E2E8F0' } }} />
        <GridToolbarDensitySelector sx={{ color: '#94A3B8', fontWeight: '500', '&:hover': { color: '#E2E8F0' } }} />
        <GridToolbarExport sx={{ color: '#94A3B8', fontWeight: '500', '&:hover': { color: '#E2E8F0' } }} />
      </Box>
      <Button 
        size="small" 
        variant="outlined" 
        onClick={() => setFilterModel({ items: [] })}
        sx={{ borderRadius: '8px', textTransform: 'none', borderColor: 'rgba(255,255,255,0.1)', color: '#94A3B8', '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: '#E2E8F0', color: '#E2E8F0' } }}
      >
        Clear Filters
      </Button>
    </GridToolbarContainer>
  );

  return (
    <>
      <Heading
        title="Staff Dashboard – Kairaa Blockchain Academy"
        description="Manage assigned students and track their progress"
        keywords="staff, dashboard, blockchain academy, students"
      />
      <AdminLayout
        title="Staff Dashboard"
        subtitle="Assigned Students Management"
        action={
          <button
            onClick={refetch}
            className="flex items-center gap-2 text-sm font-bold text-white bg-white/10 border border-white/20
              hover:border-primary/50 hover:bg-white/20 px-5 py-2.5 rounded-xl transition-all
              shadow-[0_0_10px_rgba(255,255,255,0.05)] hover:shadow-[0_0_15px_rgba(0,242,254,0.3)] backdrop-blur-md"
          >
            <FiRefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
            Sync Data
          </button>
        }
      >
        <div className="space-y-6 pb-10">

          {/* ── KPI Stats ────────────────────────────────────────────────── */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCircleCard
              label="Total Students"
              value={students.length}
              max={students.length || 1}
              displayValue={students.length}
              sub="Assigned to you"
              glow="hover:shadow-[0_0_20px_rgba(0,242,254,0.15)]"
              delay={0}
            />
            <StatCircleCard
              label="Need Follow-Up"
              value={studentsNeedingFollowUp.length}
              max={students.length || 1}
              displayValue={studentsNeedingFollowUp.length}
              sub="Inactive 7+ days"
              glow={studentsNeedingFollowUp.length > 0 ? "hover:shadow-[0_0_20px_rgba(255,23,68,0.15)]" : ""}
              delay={0.06}
            />
            <StatCircleCard
              label="Completed"
              value={completedStudents.length}
              max={students.length || 1}
              displayValue={completedStudents.length}
              sub="100% progress"
              glow="hover:shadow-[0_0_20px_rgba(0,230,118,0.15)]"
              delay={0.12}
            />
            <StatCircleCard
              label="Avg Progress"
              value={students.length ? Math.round(students.reduce((acc, s) => acc + (s.progress || 0), 0) / students.length) : 0}
              max={100}
              displayValue={`${students.length ? Math.round(students.reduce((acc, s) => acc + (s.progress || 0), 0) / students.length) : 0}%`}
              sub="Across all students"
              glow="hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]"
              delay={0.18}
            />
          </section>

          {/* ── Students Progress Tracker ─────────────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <GlassPanel>
                {/* Panel Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 border border-primary/30 text-primary">
                      <FiActivity size={16} />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">Student Progress Tracker</h2>
                      <p className="text-xs text-slate-500 mt-0.5">{students.length} students assigned</p>
                    </div>
                  </div>
                </div>

              {/* Table / DataGrid */}
              <div className="w-full">
                {isLoading ? (
                  <div className="p-8 space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <Box className="w-full min-h-[400px]">
                    <DataGrid 
                      columns={columns} 
                      rows={rows} 
                      disableRowSelectionOnClick
                      rowHeight={70}
                      filterModel={filterModel}
                      onFilterModelChange={(newModel) => setFilterModel(newModel)}
                      slots={{ toolbar: CustomToolbar }}
                      sx={{
                        border: 'none',
                        color: '#e2e8f0',
                        '& .MuiDataGrid-cell': {
                          borderBottom: '1px solid rgba(255,255,255,0.05)',
                          display: 'flex',
                          alignItems: 'center'
                        },
                        '& .MuiDataGrid-columnHeaders': {
                          borderBottom: '1px solid rgba(255,255,255,0.1)',
                          color: '#ffffff',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        },
                        '& .MuiDataGrid-footerContainer': {
                          borderTop: '1px solid rgba(255,255,255,0.1)',
                          color: '#e2e8f0',
                        },
                        '& .MuiTablePagination-root': {
                          color: '#e2e8f0',
                        },
                        '& .MuiSvgIcon-root': {
                          color: '#94a3b8',
                        },
                        '& .MuiDataGrid-row:hover': {
                          backgroundColor: 'rgba(255,255,255,0.03)',
                        }
                      }}
                    />
                  </Box>
                )}
              </div>
            </GlassPanel>
          </motion.section>

        </div>

        {/* ── Recommend Certificate Modal ───────────────────────────────── */}
        <AnimatePresence>
          {openRecommendModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpenRecommendModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", bounce: 0.3 }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-md bg-[#0B0F19] border border-success/30 rounded-2xl shadow-[0_0_50px_rgba(0,230,118,0.15)] overflow-hidden relative"
              >
                {/* Neon top border */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-success to-transparent" />

                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-success/10 border border-success/30 text-success">
                        <FiAward size={18} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">Recommend for Certificate</h3>
                        <p className="text-xs text-slate-400 mt-0.5">This will notify the admin for approval</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setOpenRecommendModal(false)}
                      className="text-slate-400 hover:text-white transition-colors p-1"
                    >
                      <FiX size={20} />
                    </button>
                  </div>

                  {/* Student Info Card */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Student</span>
                      <span className="font-bold text-white">{selectedStudent?.student?.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Course</span>
                      <span className="font-bold text-white">{selectedStudent?.course?.name}</span>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="mb-5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                      Staff Notes (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="E.g., Excellent final assignment execution."
                      className="bg-white/5 border border-slate-600 text-white text-sm rounded-xl px-4 py-2.5 outline-none
                        focus:border-success focus:shadow-[0_0_15px_rgba(0,230,118,0.2)] transition-all
                        placeholder-slate-500 w-full resize-none"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setOpenRecommendModal(false)}
                      className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 text-slate-300
                        rounded-xl text-sm font-bold hover:bg-white/10 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleRecommendSubmit}
                      disabled={isRecommending}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5
                        bg-success/10 border border-success/50 text-success rounded-xl text-sm font-bold
                        hover:bg-success/20 hover:shadow-[0_0_20px_rgba(0,230,118,0.3)] transition-all
                        disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <FiAward size={13} />
                      {isRecommending ? "Submitting..." : "Submit Recommendation"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </AdminLayout>
    </>
  );
};

export default StaffDashboardPage;
