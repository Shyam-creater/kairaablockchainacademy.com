import React, { useState, useEffect } from "react";
import Heading from "../../components/Heading";
import AdminLayout from "../../components/Admin/AdminLayout";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { 
  useGetCourseQuizzesQuery, 
  useCreateOrUpdateQuizMutation, 
  useGetStaffAssignedCoursesQuery,
  useGetQuizAnalyticsQuery,
  useGetQuizLeaderboardQuery,
  useGetStudentResultsQuery
} from "../../redux/features/staff/staffApi";
import { 


  FiFileText, FiPlus, FiSave, FiEye, FiTrash2, FiClock, FiSettings, 
  FiAward, FiTrendingUp, FiActivity, FiDownload, FiCheckCircle, FiXCircle,
  FiCalendar, FiShuffle, FiImage, FiMinusCircle
} from "react-icons/fi";

// ─── Date Helpers ─────────────────────────────────────────────────────────────
const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";
const fmtDateTime = (iso) =>
  iso ? new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true }) : "—";
const fmtTime = (iso) =>
  iso ? new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }) : "—";
// ────────────────────────────────────────────────────────────────────────────


// ── Neon UI Primitives ────────────────────────────────────────────────────────
const GlassPanel = ({ children, className = "", glow = "" }) => (
  <div className={`bg-surface/40 backdrop-blur-xl border border-white/10 rounded-2xl relative overflow-hidden ${glow} ${className}`}>
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    {children}
  </div>
);

const NeonBadge = ({ status }) => {
  const map = {
    published: { label: "Published", cls: "bg-success/10 text-success border-success/30 shadow-[0_0_10px_rgba(0,230,118,0.2)]" },
    draft:     { label: "Draft",     cls: "bg-warning/10 text-warning border-warning/30 shadow-[0_0_10px_rgba(255,179,0,0.2)]" },
    archived:  { label: "Archived",  cls: "bg-slate-500/10 text-slate-400 border-slate-500/30" }
  };
  const { label, cls } = map[status] || map.draft;
  return <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${cls}`}>{label}</span>;
};

const NeonInput = ({ label, ...props }) => (
  <div className="flex flex-col gap-1 w-full">
    {label && <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>}
    <input
      {...props}
      className="bg-surface/50 border border-slate-600 text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(0,242,254,0.2)] transition-all placeholder-slate-500 w-full"
    />
  </div>
);

const NeonTextarea = ({ label, ...props }) => (
  <div className="flex flex-col gap-1 w-full">
    {label && <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>}
    <textarea
      {...props}
      className="bg-surface/50 border border-slate-600 text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(0,242,254,0.2)] transition-all placeholder-slate-500 w-full resize-none"
    />
  </div>
);

const NeonSelect = ({ label, children, ...props }) => (
  <div className="flex flex-col gap-1 w-full">
    {label && <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>}
    <select
      {...props}
      className="bg-[#0B0F19] border border-slate-600 text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(0,242,254,0.2)] transition-all w-full"
    >
      {children}
    </select>
  </div>
);

const NeonButton = ({ children, onClick, disabled, variant = "primary", className = "", type="button" }) => {
  const variants = {
    primary:   "bg-primary/10 border-primary/50 text-primary hover:bg-primary/20 hover:shadow-[0_0_20px_rgba(0,242,254,0.3)]",
    secondary: "bg-accent/10  border-accent/50  text-accent  hover:bg-accent/20  hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]",
    success:   "bg-success/10 border-success/50 text-success hover:bg-success/20 hover:shadow-[0_0_20px_rgba(0,230,118,0.3)]",
    danger:    "bg-danger/10  border-danger/50  text-danger  hover:bg-danger/20  hover:shadow-[0_0_20px_rgba(255,23,68,0.3)]",
    ghost:     "bg-white/5    border-white/10   text-slate-300 hover:bg-white/10 hover:text-white",
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const ToggleSwitch = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl">
    <span className="text-sm font-bold text-slate-300">{label}</span>
    <button onClick={() => onChange(!checked)} className={`w-10 h-5 rounded-full relative transition-all duration-300 ${checked ? 'bg-primary' : 'bg-slate-600'}`}>
      <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-all duration-300 ${checked ? 'left-[22px]' : 'left-1'}`} />
    </button>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const StaffQuizPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // RTK Queries
  const { data: coursesData } = useGetStaffAssignedCoursesQuery();
  const { data: analyticsData } = useGetQuizAnalyticsQuery();
  const { data: leaderboardData } = useGetQuizLeaderboardQuery("");
  const { data: resultsData } = useGetStudentResultsQuery("");

  const analytics = analyticsData?.analytics || { totalQuizzes:0, publishedQuizzes:0, draftQuizzes:0, totalAttempts:0, averageScore:0, averagePassRate:0 };
  const leaderboard = leaderboardData?.leaderboard || [];
  const results = resultsData?.results || [];

  // Courses mapping
  const assignedCourses = coursesData?.assignedCourses || [];
  const uniqueCourses = assignedCourses.map(c => ({ id: c._id, name: c.name }));

  // Builder States
  const [selectedCourse, setSelectedCourse] = useState("");
  const { data: quizzesData, refetch: refetchQuizzes } = useGetCourseQuizzesQuery(selectedCourse, { skip: !selectedCourse });
  const [createOrUpdateQuiz, { isLoading }] = useCreateOrUpdateQuizMutation();

  useEffect(() => {
    if (uniqueCourses.length === 1 && !selectedCourse) {
      setSelectedCourse(uniqueCourses[0].id);
    }
  }, [uniqueCourses, selectedCourse]);

  const [sectionName, setSectionName] = useState("");
  const [status, setStatus] = useState("draft");
  const [instructions, setInstructions] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [availableUntil, setAvailableUntil] = useState("");
  const [shuffleQuestions, setShuffleQuestions] = useState(false);
  const [shuffleOptions, setShuffleOptions] = useState(false);
  const [negativeMarking, setNegativeMarking] = useState(false);
  const [deductionPerWrongAnswer, setDeductionPerWrongAnswer] = useState(0);
  const [passMark, setPassMark] = useState(70);
  const [timeLimit, setTimeLimit] = useState(15);
  const [maxAttempts, setMaxAttempts] = useState(3);
  const [questions, setQuestions] = useState([]);
  
  const [showPreview, setShowPreview] = useState(false);

  // Handlers
  const handleLoadQuiz = (quiz) => {
    setSectionName(quiz.sectionName || "");
    setStatus(quiz.status || "draft");
    setInstructions(quiz.instructions || "");
    setAvailableFrom(quiz.availableFrom ? new Date(quiz.availableFrom).toISOString().slice(0,16) : "");
    setAvailableUntil(quiz.availableUntil ? new Date(quiz.availableUntil).toISOString().slice(0,16) : "");
    setShuffleQuestions(quiz.shuffleQuestions || false);
    setShuffleOptions(quiz.shuffleOptions || false);
    setNegativeMarking(quiz.negativeMarking || false);
    setDeductionPerWrongAnswer(quiz.deductionPerWrongAnswer || 0);
    setPassMark(quiz.passMark || 70);
    setTimeLimit(quiz.timeLimit || 15);
    setMaxAttempts(quiz.maxAttempts || 3);
    setQuestions(quiz.questions || []);
  };

  const handleSaveQuiz = async () => {
    if (!selectedCourse || !sectionName || questions.length === 0) {
      toast.error("Please select a course, enter a title, and add at least one question.");
      return;
    }
    
    // Validate correct options
    const invalidQuestion = questions.find(q => q.correctOptionIndex < 0 || q.correctOptionIndex >= q.options.length || q.options.some(opt => opt.trim() === ""));
    if (invalidQuestion) {
      toast.error("Ensure all questions have valid options and a correct answer selected.");
      return;
    }

    try {
      await createOrUpdateQuiz({
        courseId: selectedCourse,
        sectionName,
        status, instructions,
        availableFrom: availableFrom || null, availableUntil: availableUntil || null,
        shuffleQuestions, shuffleOptions, negativeMarking, deductionPerWrongAnswer,
        passMark, timeLimit, maxAttempts, questions
      }).unwrap();
      
      toast.success("Quiz saved successfully!");
      refetchQuizzes();
    } catch (error) {
      toast.error(typeof (error?.data?.message || "Failed to save quiz") === "string" ? (error?.data?.message || "Failed to save quiz") : JSON.stringify(error?.data?.message || "Failed to save quiz") || "An error occurred");
    }
  };

  const exportCSV = () => {
    if (!results.length) { toast.error("No data to export"); return; }
    const headers = "Student Name,Email,Quiz Name,Score,Passed,Time Taken (s),Date\n";
    const rows = results.map(r => `${r.userId?.name},${r.userId?.email},${r.quizId?.sectionName},${r.score},${r.passed ? 'Yes':'No'},${r.timeTaken||0},${fmtDate(r.completionDate)}`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student_quiz_results.csv";
    a.click();
    toast.success("CSV Exported!");
  };

  // Rendering Functions
  const renderDashboard = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "Total Quizzes", value: analytics.totalQuizzes, icon: <FiFileText />, col: "text-primary" },
          { label: "Published", value: analytics.publishedQuizzes, icon: <FiCheckCircle />, col: "text-success" },
          { label: "Drafts", value: analytics.draftQuizzes, icon: <FiSettings />, col: "text-warning" },
          { label: "Total Attempts", value: analytics.totalAttempts, icon: <FiActivity />, col: "text-accent" },
          { label: "Avg Score", value: `${analytics.averageScore}%`, icon: <FiTrendingUp />, col: "text-info" },
          { label: "Avg Pass Rate", value: `${analytics.averagePassRate}%`, icon: <FiAward />, col: "text-success" },
        ].map((s, i) => (
          <GlassPanel key={i} className="p-5 flex items-center gap-4 hover:-translate-y-1 transition-transform">
            <div className={`text-3xl ${s.col}`}>{s.icon}</div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
              <p className="text-2xl font-extrabold text-white">{s.value}</p>
            </div>
          </GlassPanel>
        ))}
      </div>
    </motion.div>
  );

  const renderBuilder = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      {/* Left sidebar for course/quiz selection */}
      <div className="xl:col-span-3 space-y-4">
        <GlassPanel className="p-4 space-y-4">
          <NeonSelect label="Target Course" value={selectedCourse} onChange={e => { setSelectedCourse(e.target.value); setQuestions([]); }}>
            <option value="">-- Select Course --</option>
            {uniqueCourses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </NeonSelect>

          {selectedCourse && (
            <div className="space-y-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-white/10 pb-2">Existing Quizzes</p>
              {quizzesData?.quizzes?.length > 0 ? quizzesData.quizzes.map(q => (
                <button key={q._id} onClick={() => handleLoadQuiz(q)} className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5 flex items-center justify-between group">
                  <div className="truncate pr-2 text-sm text-slate-200">{q.sectionName}</div>
                  <NeonBadge status={q.status} />
                </button>
              )) : (
                <p className="text-xs text-slate-500 py-2">No quizzes found.</p>
              )}
              <NeonButton variant="ghost" className="w-full mt-2" onClick={() => { handleLoadQuiz({}); setSectionName(""); setQuestions([]); }}>
                <FiPlus /> New Quiz
              </NeonButton>
            </div>
          )}
        </GlassPanel>
      </div>

      {/* Main Builder Area */}
      <div className="xl:col-span-9 space-y-6">
        <GlassPanel className="p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2"><FiSettings className="text-primary"/> Quiz Configuration</h3>
            <div className="flex gap-2">
              <NeonButton variant="ghost" onClick={() => setShowPreview(true)} disabled={questions.length === 0}><FiEye /> Preview</NeonButton>
              <NeonButton variant="success" onClick={handleSaveQuiz} disabled={isLoading}><FiSave /> {isLoading ? "Saving..." : "Save Quiz"}</NeonButton>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NeonInput label="Quiz Title / Section" value={sectionName} onChange={e => setSectionName(e.target.value)} placeholder="e.g., Module 1 Assessment" />
            <NeonSelect label="Status" value={status} onChange={e => setStatus(e.target.value)}>
              <option value="draft">Draft (Hidden)</option>
              <option value="published">Published (Visible)</option>
              <option value="archived">Archived</option>
            </NeonSelect>
          </div>

          <NeonTextarea label="Instructions (Optional)" value={instructions} onChange={e => setInstructions(e.target.value)} placeholder="Rich text instructions for students..." rows={3} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NeonInput label="Available From" type="datetime-local" value={availableFrom} onChange={e => setAvailableFrom(e.target.value)} />
            <NeonInput label="Available Until" type="datetime-local" value={availableUntil} onChange={e => setAvailableUntil(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <NeonInput label="Pass Mark (%)" type="number" value={passMark} onChange={e => setPassMark(e.target.value)} />
            <NeonInput label="Time Limit (mins)" type="number" value={timeLimit} onChange={e => setTimeLimit(e.target.value)} />
            <NeonInput label="Max Attempts" type="number" value={maxAttempts} onChange={e => setMaxAttempts(e.target.value)} />
            <NeonInput label="Deduct / Wrong" type="number" value={deductionPerWrongAnswer} onChange={e => setDeductionPerWrongAnswer(e.target.value)} disabled={!negativeMarking} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/10 pt-4">
            <ToggleSwitch label="Shuffle Questions" checked={shuffleQuestions} onChange={setShuffleQuestions} />
            <ToggleSwitch label="Shuffle Options" checked={shuffleOptions} onChange={setShuffleOptions} />
            <ToggleSwitch label="Negative Marking" checked={negativeMarking} onChange={setNegativeMarking} />
          </div>
        </GlassPanel>

        {/* Questions Area */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-white flex items-center gap-2"><FiFileText className="text-accent" /> Question Builder ({questions.length})</h3>
            <NeonButton variant="secondary" onClick={() => setQuestions([...questions, { question:"", options:["",""], correctOptionIndex:0, difficulty:"medium", explanation:"", image:"" }])}>
              <FiPlus /> Add Question
            </NeonButton>
          </div>

          <AnimatePresence>
            {questions.map((q, qIndex) => (
              <motion.div key={qIndex} initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, height:0}} className="mb-4">
                <GlassPanel className="p-5 border-l-4 border-l-accent space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-4">
                      <div className="flex gap-4">
                        <NeonTextarea label={`Question ${qIndex + 1}`} value={q.question} onChange={e => { const n = [...questions]; n[qIndex].question = e.target.value; setQuestions(n); }} rows={2} />
                        <div className="w-48 space-y-4">
                          <NeonSelect label="Difficulty" value={q.difficulty} onChange={e => { const n = [...questions]; n[qIndex].difficulty = e.target.value; setQuestions(n); }}>
                            <option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
                          </NeonSelect>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Options (Select Correct)</p>
                        {q.options.map((opt, oIndex) => (
                          <div key={oIndex} className="flex items-center gap-3">
                            <input type="radio" name={`correct-${qIndex}`} checked={q.correctOptionIndex === oIndex} onChange={() => { const n = [...questions]; n[qIndex].correctOptionIndex = oIndex; setQuestions(n); }} className="w-4 h-4 accent-primary" />
                            <input type="text" value={opt} onChange={e => { const n = [...questions]; n[qIndex].options[oIndex] = e.target.value; setQuestions(n); }} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:border-primary outline-none transition-all" placeholder={`Option ${oIndex + 1}`} />
                            <button onClick={() => { const n = [...questions]; n[qIndex].options.splice(oIndex,1); if(q.correctOptionIndex >= oIndex && q.correctOptionIndex > 0) n[qIndex].correctOptionIndex--; setQuestions(n); }} className="text-slate-500 hover:text-danger p-1"><FiMinusCircle /></button>
                          </div>
                        ))}
                        <button onClick={() => { const n = [...questions]; n[qIndex].options.push(""); setQuestions(n); }} className="text-xs text-primary font-bold hover:underline flex items-center gap-1 mt-1"><FiPlus /> Add Option</button>
                      </div>

                      <NeonInput label="Explanation (Shown after submission)" value={q.explanation || ""} onChange={e => { const n = [...questions]; n[qIndex].explanation = e.target.value; setQuestions(n); }} placeholder="Why is this answer correct?" />
                    </div>

                    <div className="flex flex-col items-end gap-4 border-l border-white/10 pl-4 h-full">
                      <button onClick={() => { const n = [...questions]; n.splice(qIndex,1); setQuestions(n); }} className="text-slate-400 hover:text-danger bg-white/5 p-2 rounded-lg hover:bg-danger/10 transition-colors"><FiTrash2 size={18} /></button>
                      <div className="w-24 h-24 border border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center text-slate-500 cursor-pointer hover:border-primary/50 hover:text-primary transition-colors bg-white/5 text-[10px] text-center p-2">
                        <FiImage size={24} className="mb-1" />
                        Upload Image
                      </div>
                    </div>
                  </div>
                </GlassPanel>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );

  const renderLeaderboard = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <GlassPanel className="overflow-hidden">
        <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-sm font-bold text-white flex items-center gap-2"><FiAward className="text-warning" /> Top 50 Leaderboard</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-black/20 text-xs uppercase text-slate-500 border-b border-white/10">
              <tr>
                <th className="p-4">Rank</th>
                <th className="p-4">Student</th>
                <th className="p-4">Quiz</th>
                <th className="p-4">Score</th>
                <th className="p-4">Time Taken</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, idx) => (
                <tr key={idx} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${idx < 3 ? 'bg-primary/5' : ''}`}>
                  <td className="p-4 font-extrabold flex items-center gap-2">
                    {idx === 0 && <FiAward className="text-warning text-xl drop-shadow-[0_0_8px_#ffb300]" />}
                    {idx === 1 && <FiAward className="text-slate-300 text-lg" />}
                    {idx === 2 && <FiAward className="text-[#cd7f32] text-lg" />}
                    #{idx + 1}
                  </td>
                  <td className="p-4 font-bold text-white">{entry.userId?.name}</td>
                  <td className="p-4 text-xs">{entry.quizId?.sectionName}</td>
                  <td className="p-4 font-bold text-success">{entry.score}%</td>
                  <td className="p-4 text-xs font-mono">{entry.timeTaken ? `${entry.timeTaken}s` : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {leaderboard.length === 0 && <div className="p-8 text-center text-slate-500">No attempts recorded yet.</div>}
        </div>
      </GlassPanel>
    </motion.div>
  );

  const renderResults = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <GlassPanel className="overflow-hidden">
        <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-sm font-bold text-white flex items-center gap-2"><FiActivity className="text-info" /> Detailed Student Results</h3>
          <NeonButton variant="ghost" onClick={exportCSV}><FiDownload /> Export CSV</NeonButton>
        </div>
        <div className="overflow-x-auto max-h-[600px]">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-black/20 text-xs uppercase text-slate-500 border-b border-white/10 sticky top-0 backdrop-blur-md">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Student Name</th>
                <th className="p-4">Quiz Name</th>
                <th className="p-4">Score</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {results.map((res, idx) => (
                <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-xs">{fmtDate(res.completionDate || res.createdAt)}</td>
                  <td className="p-4 font-bold text-white">{res.userId?.name}</td>
                  <td className="p-4 text-xs">{res.quizId?.sectionName}</td>
                  <td className="p-4 font-bold">{res.score}%</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${res.passed ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>
                      {res.passed ? 'Passed' : 'Failed'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {results.length === 0 && <div className="p-8 text-center text-slate-500">No records found.</div>}
        </div>
      </GlassPanel>
    </motion.div>
  );

  return (
    <>
      <Heading title="LMS Quiz Management" description="Premium Assessment System" keywords="staff, quiz, lms" />
      <AdminLayout title="Quiz Command Center" subtitle="Manage Assessments, Analytics & Results">
        
        {/* Tab Navigation */}
        <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-xl w-fit mb-6 overflow-x-auto">
          {[
            { id: "dashboard", label: "Dashboard", icon: <FiActivity /> },
            { id: "builder", label: "Quiz Builder", icon: <FiFileText /> },
            { id: "leaderboard", label: "Leaderboard", icon: <FiAward /> },
            { id: "results", label: "Student Results", icon: <FiTrendingUp /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.id 
                  ? "bg-primary/20 text-primary border border-primary/40 shadow-[0_0_15px_rgba(0,242,254,0.2)]" 
                  : "text-slate-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Router */}
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && <motion.div key="dashboard" exit={{opacity:0}}>{renderDashboard()}</motion.div>}
          {activeTab === "builder"   && <motion.div key="builder" exit={{opacity:0}}>{renderBuilder()}</motion.div>}
          {activeTab === "leaderboard" && <motion.div key="leaderboard" exit={{opacity:0}}>{renderLeaderboard()}</motion.div>}
          {activeTab === "results"   && <motion.div key="results" exit={{opacity:0}}>{renderResults()}</motion.div>}
        </AnimatePresence>

      </AdminLayout>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{scale:0.95, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.95, opacity:0}} className="w-full max-w-4xl max-h-[90vh] bg-[#0B0F19] border border-primary/30 rounded-2xl shadow-[0_0_50px_rgba(0,242,254,0.15)] flex flex-col overflow-hidden">
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                <h3 className="font-bold text-white flex items-center gap-2"><FiEye className="text-primary"/> Student Preview: {sectionName || "Untitled Quiz"}</h3>
                <button onClick={() => setShowPreview(false)} className="text-slate-400 hover:text-white"><FiXCircle size={24} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-surface/30">
                {/* Instructions */}
                {instructions && (
                  <div className="p-4 rounded-xl bg-info/10 border border-info/30 text-info text-sm">
                    <strong>Instructions:</strong> <p className="mt-1">{instructions}</p>
                  </div>
                )}
                
                {questions.map((q, i) => (
                  <div key={i} className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="text-lg font-bold text-white"><span className="text-primary mr-2">Q{i+1}.</span>{q.question || "Empty Question"}</h4>
                      <NeonBadge status={q.difficulty || "medium"} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="p-3 rounded-lg border border-white/10 bg-black/20 text-slate-300 text-sm hover:border-primary/50 cursor-pointer transition-all">
                          {opt || `Option ${oIdx+1}`}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default StaffQuizPage;
