import React, { useState, useRef, useEffect } from "react";
import Heading from "../../components/Heading";
import AdminLayout from "../../components/Admin/AdminLayout";
import { motion, AnimatePresence } from "framer-motion";
import { useGetStaffDoubtsQuery, useReplyToDoubtMutation, useResolveDoubtMutation } from "../../redux/features/staff/staffApi";
import toast from "react-hot-toast";
import { FiSend, FiCheckCircle, FiAlertCircle, FiPaperclip, FiUser, FiClock, FiTag, FiBookOpen, FiActivity, FiMessageSquare } from "react-icons/fi";
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
    open:     { label: "Open",     cls: "bg-warning/10 text-warning border-warning/30 shadow-[0_0_8px_rgba(255,179,0,0.2)]"  },
    resolved: { label: "Resolved", cls: "bg-success/10 text-success border-success/30 shadow-[0_0_8px_rgba(0,230,118,0.2)]" },
  };
  const { label, cls } = map[status] || map.open;
  return <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${cls}`}>{label}</span>;
};

// ── Circular Progress Widget ────────────────────────────────────────────────
const CircularProgress = ({ value, max = 100, label, sub, colorClass, hexColor }) => {
  const pct = Math.min((Number(value) / (Number(max) || 1)) * 100, 100);
  const radius = 28;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (pct / 100) * circ;

  return (
    <GlassPanel className="p-4 flex items-center gap-4 hover:-translate-y-1 transition-all duration-300 group">
      <div className="relative w-14 h-14 flex-shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="none" />
          <circle
            cx="32" cy="32" r={radius}
            stroke={hexColor} strokeWidth="6" fill="none" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease", filter: `drop-shadow(0 0 4px ${hexColor}99)` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xs font-extrabold ${colorClass} leading-none`}>{value}</span>
        </div>
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-[9px] text-slate-500 font-medium">{sub}</p>
      </div>
    </GlassPanel>
  );
};

// ── Main Component ──────────────────────────────────────────────────────────
const StaffDoubtCenterPage = () => {
  const { data, isLoading, refetch } = useGetStaffDoubtsQuery();
  const doubts = data?.doubts || [];
  const [replyToDoubt, { isLoading: isReplying }] = useReplyToDoubtMutation();
  const [resolveDoubt, { isLoading: isResolving }] = useResolveDoubtMutation();
  
  const [activeDoubt, setActiveDoubt] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'open', 'resolved'
  const chatEndRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeDoubt?.replies]);

  const handleReply = async () => {
    if (!replyMessage.trim() || !activeDoubt) return;
    try {
      await replyToDoubt({ doubtId: activeDoubt._id, message: replyMessage }).unwrap();
      toast.success("Reply sent successfully");
      setReplyMessage("");
      refetch();
      setActiveDoubt(prev => ({
        ...prev,
        replies: [...prev.replies, { sender: "staff", message: replyMessage, createdAt: new Date() }]
      }));
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send reply");
    }
  };

  const handleResolve = async () => {
    if (!activeDoubt) return;
    try {
      await resolveDoubt(activeDoubt._id).unwrap();
      toast.success("Ticket marked as resolved");
      setActiveDoubt(prev => ({ ...prev, status: "resolved" }));
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to resolve ticket");
    }
  };

  const handleQuickReply = (template) => {
    setReplyMessage(prev => prev + (prev ? " " : "") + template);
  };

  const openCount     = doubts.filter(d => d.status === "open").length;
  const resolvedCount = doubts.filter(d => d.status === "resolved").length;
  const totalCount    = doubts.length;

  const filteredDoubts = doubts.filter(d => filter === "all" || d.status === filter);

  // Helper to determine simulated priority
  const getPriority = (doubt) => {
    const hoursOld = (new Date() - new Date(doubt.createdAt)) / (1000 * 60 * 60);
    if (doubt.status === "resolved") return { label: "Low", color: "text-slate-500", bg: "bg-white/5", border: "border-white/10" };
    if (hoursOld > 24) return { label: "High", color: "text-danger", bg: "bg-danger/10", border: "border-danger/30" };
    if (hoursOld > 12) return { label: "Medium", color: "text-warning", bg: "bg-warning/10", border: "border-warning/30" };
    return { label: "Normal", color: "text-primary", bg: "bg-primary/10", border: "border-primary/30" };
  };

  return (
    <>
      <Heading title="Support Command Center" description="Premium SaaS Help Desk Workspace" keywords="staff, support, help desk" />
      <AdminLayout title="Support Command Center" subtitle="Real-time Student Help Desk">

        {/* Analytics Header */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <CircularProgress value={openCount} max={totalCount} label="Open Tickets" sub={`${openCount} awaiting reply`} colorClass="text-warning" hexColor="#ffb300" />
          <CircularProgress value={resolvedCount} max={totalCount} label="Resolved" sub={`${resolvedCount} successful resolutions`} colorClass="text-success" hexColor="#00e676" />
          <CircularProgress value={totalCount} max={totalCount} label="Total Volume" sub="All-time queries" colorClass="text-primary" hexColor="#00f2fe" />
          <CircularProgress value={openCount > 0 ? 100 : 0} max={100} label="Response Rate" sub="SLA Health" colorClass="text-accent" hexColor="#8b5cf6" />
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[750px]">
          
          {/* Column 1: Support Queue */}
          <GlassPanel className="lg:col-span-3 flex flex-col h-full">
            <div className="p-4 border-b border-white/5">
              <h3 className="text-sm font-bold text-white tracking-wide mb-3 flex items-center gap-2"><FiMessageSquare className="text-primary" /> Active Queue</h3>
              
              {/* Filter Chips */}
              <div className="flex gap-2">
                {["all", "open", "resolved"].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full transition-all ${
                      filter === f 
                        ? "bg-primary/20 text-primary border border-primary/50 shadow-[0_0_10px_rgba(0,242,254,0.2)]" 
                        : "bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-hide">
              {isLoading ? (
                <div className="text-center text-slate-500 py-10 text-xs">Loading queue...</div>
              ) : filteredDoubts.length > 0 ? (
                filteredDoubts.map(doubt => {
                  const priority = getPriority(doubt);
                  return (
                    <div
                      key={doubt._id}
                      onClick={() => setActiveDoubt(doubt)}
                      className={`p-3 rounded-xl cursor-pointer transition-all border ${
                        activeDoubt?._id === doubt._id 
                          ? "bg-primary/10 border-primary/40 shadow-[0_0_15px_rgba(0,242,254,0.1)]" 
                          : "bg-transparent border-transparent hover:bg-white/5 hover:border-white/10"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1.5">
                        <p className="text-xs font-bold text-white truncate max-w-[150px]">{doubt.title}</p>
                        {doubt.status === "open" ? (
                          <div className={`w-2 h-2 rounded-full ${priority.bg.replace('/10', '')} shadow-[0_0_5px_currentColor] ${priority.color}`} />
                        ) : (
                          <FiCheckCircle size={10} className="text-success" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mb-1.5 leading-snug">{doubt.description}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-[9px] text-primary/70">{doubt.studentId?.name}</p>
                        <p className="text-[9px] text-slate-500">{format(doubt.createdAt)}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-slate-500 py-10 text-xs">Queue is empty.</div>
              )}
            </div>
          </GlassPanel>

          {/* Column 2: Chat Interaction Area */}
          <GlassPanel className="lg:col-span-6 flex flex-col h-full">
            {activeDoubt ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <NeonBadge status={activeDoubt.status} />
                      <p className="text-sm font-extrabold text-white">{activeDoubt.title}</p>
                    </div>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1.5">
                      <FiTag size={10} /> Ticket #{activeDoubt._id.slice(-6).toUpperCase()} • {activeDoubt.courseId?.name}
                    </p>
                  </div>
                  {activeDoubt.status === "open" && (
                    <button
                      onClick={handleResolve}
                      disabled={isResolving}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-success/10 border border-success/30 text-success rounded-lg text-xs font-bold hover:bg-success/20 hover:shadow-[0_0_15px_rgba(0,230,118,0.2)] transition-all"
                    >
                      <FiCheckCircle size={12} /> Resolve
                    </button>
                  )}
                </div>

                {/* Messages Window */}
                <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-hide bg-[#0B0F19]/20">
                  
                  {/* Original Thread Start */}
                  <div className="flex flex-col gap-1 items-start">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-full bg-surface border border-white/10 flex items-center justify-center text-[10px] text-slate-400">
                        {activeDoubt.studentId?.name?.charAt(0) || <FiUser />}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">{activeDoubt.studentId?.name}</span>
                      <span className="text-[9px] text-slate-500">{fmtDateTime(activeDoubt.createdAt)}</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none max-w-[85%] shadow-sm ml-8">
                      <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">{activeDoubt.description}</p>
                    </div>
                  </div>

                  {/* Replies */}
                  {activeDoubt.replies && activeDoubt.replies.map((reply, i) => {
                    const isStaff = reply.sender === "staff";
                    return (
                      <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col gap-1 ${isStaff ? "items-end" : "items-start"}`}>
                        <div className="flex items-center gap-2 mb-1">
                          {isStaff && <span className="text-[9px] text-slate-500">{fmtDateTime(reply.createdAt)}</span>}
                          {isStaff && <span className="text-[10px] font-bold text-primary">You (Support)</span>}
                          
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${isStaff ? "bg-primary/20 border border-primary/40 text-primary shadow-[0_0_10px_rgba(0,242,254,0.3)]" : "bg-surface border border-white/10 text-slate-400"}`}>
                            {isStaff ? "S" : activeDoubt.studentId?.name?.charAt(0)}
                          </div>
                          
                          {!isStaff && <span className="text-[10px] font-bold text-slate-400">{activeDoubt.studentId?.name}</span>}
                          {!isStaff && <span className="text-[9px] text-slate-500">{fmtDateTime(reply.createdAt)}</span>}
                        </div>
                        
                        <div className={`p-4 rounded-2xl max-w-[85%] shadow-sm ${isStaff ? "mr-8 bg-primary/10 border border-primary/30 text-white rounded-tr-none" : "ml-8 bg-white/5 border border-white/10 rounded-tl-none text-slate-200"}`}>
                          <p className="text-sm whitespace-pre-wrap leading-relaxed">{reply.message}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
                {activeDoubt.status === "open" ? (
                  <div className="p-4 border-t border-white/5 bg-white/[0.01]">
                    {/* Quick Responses */}
                    <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide pb-1">
                      {["Looking into this now.", "Could you provide a screenshot?", "Please check the latest module.", "I have resolved this issue."].map((tpl, i) => (
                        <button key={i} onClick={() => handleQuickReply(tpl)} className="whitespace-nowrap px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                          {tpl}
                        </button>
                      ))}
                    </div>
                    
                    <div className="relative">
                      <textarea
                        value={replyMessage}
                        onChange={e => setReplyMessage(e.target.value)}
                        rows={3}
                        placeholder="Write your response..."
                        className="bg-surface/50 border border-slate-600 text-white text-sm rounded-xl px-4 py-3 pb-10 outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(0,242,254,0.15)] transition-all placeholder-slate-500 w-full resize-none"
                        onKeyDown={e => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleReply();
                          }
                        }}
                      />
                      <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                        <button className="p-2 text-slate-400 hover:text-primary transition-colors rounded-lg hover:bg-white/5">
                          <FiPaperclip size={14} />
                        </button>
                        <button
                          onClick={handleReply}
                          disabled={!replyMessage.trim() || isReplying}
                          className="flex items-center gap-1.5 px-4 py-1.5 bg-primary border border-primary text-[#0B0F19] rounded-lg text-xs font-bold hover:bg-primary/90 hover:shadow-[0_0_15px_rgba(0,242,254,0.4)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {isReplying ? "Sending..." : <><FiSend size={12} /> Reply</>}
                        </button>
                      </div>
                    </div>
                    <p className="text-[9px] text-slate-500 mt-2 text-right">Press Enter to send, Shift + Enter for new line</p>
                  </div>
                ) : (
                  <div className="p-4 border-t border-white/5 text-center bg-white/[0.01]">
                    <div className="inline-flex items-center gap-2 text-xs font-bold text-success bg-success/10 border border-success/30 px-4 py-2 rounded-xl shadow-[0_0_15px_rgba(0,230,118,0.1)]">
                      <FiCheckCircle size={14} /> This ticket is resolved and closed.
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-4 text-center opacity-60">
                <div className="w-24 h-24 mb-2 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                  <FiMessageSquare className="text-primary opacity-50" />
                </div>
                <h2 className="text-xl font-bold text-white mb-1">No Ticket Selected</h2>
                <p className="text-sm text-slate-400 max-w-sm">Select a query from the active queue to view details and respond.</p>
              </div>
            )}
          </GlassPanel>

          {/* Column 3: Context & Knowledge Base */}
          <GlassPanel className="lg:col-span-3 flex flex-col h-full bg-surface/20">
            {activeDoubt ? (
              <div className="flex flex-col h-full">
                {/* Student Profile Panel */}
                <div className="p-5 border-b border-white/5">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Student Context</h3>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center text-primary font-bold text-2xl shadow-[0_0_15px_rgba(0,242,254,0.3)] mb-3">
                      {activeDoubt.studentId?.name?.charAt(0) || <FiUser />}
                    </div>
                    <p className="text-sm font-bold text-white">{activeDoubt.studentId?.name}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{activeDoubt.studentId?.email || "Student Account"}</p>
                  </div>
                  
                  <div className="mt-5 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Course</span>
                      <span className="text-white font-semibold truncate max-w-[120px]">{activeDoubt.courseId?.name}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Priority</span>
                      <span className={`font-bold ${getPriority(activeDoubt).color}`}>{getPriority(activeDoubt).label}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Wait Time</span>
                      <span className="text-warning font-semibold">{format(activeDoubt.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Knowledge Base Suggestions */}
                <div className="p-5 border-b border-white/5">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><FiBookOpen /> Suggested Articles</h3>
                  <div className="space-y-2">
                    {["How to setup the dev environment", "Resolving common smart contract errors", "Submitting your final assignment"].map((art, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-primary/30 hover:bg-primary/5 cursor-pointer transition-all flex items-start gap-2 group">
                        <FiBookOpen className="text-primary/50 group-hover:text-primary mt-0.5 flex-shrink-0" size={12} />
                        <p className="text-[10px] text-slate-300 group-hover:text-white leading-tight">{art}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activity Timeline */}
                <div className="p-5 flex-1 overflow-y-auto">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><FiActivity /> Ticket Timeline</h3>
                  <div className="relative pl-4 space-y-4 before:absolute before:left-[5px] before:top-1 before:bottom-1 before:w-px before:bg-white/10">
                    <div className="relative text-xs">
                      <div className="absolute -left-4 top-1 w-2 h-2 rounded-full bg-primary shadow-[0_0_5px_#00f2fe]" />
                      <p className="text-white">Ticket Created</p>
                      <p className="text-[9px] text-slate-500 mt-0.5">{fmtDateTime(activeDoubt.createdAt)}</p>
                    </div>
                    {activeDoubt.replies?.length > 0 && (
                      <div className="relative text-xs">
                        <div className="absolute -left-4 top-1 w-2 h-2 rounded-full bg-info shadow-[0_0_5px_#2979ff]" />
                        <p className="text-white">First Response</p>
                        <p className="text-[9px] text-slate-500 mt-0.5">{fmtDateTime(activeDoubt.replies[0].createdAt)}</p>
                      </div>
                    )}
                    {activeDoubt.status === "resolved" && (
                      <div className="relative text-xs">
                        <div className="absolute -left-4 top-1 w-2 h-2 rounded-full bg-success shadow-[0_0_5px_#00e676]" />
                        <p className="text-success font-bold">Resolved</p>
                        <p className="text-[9px] text-slate-500 mt-0.5">By Support Staff</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-5 text-center">
                <p className="text-xs text-slate-500">Student context and insights will appear here when a ticket is selected.</p>
              </div>
            )}
          </GlassPanel>

        </div>
      </AdminLayout>
    </>
  );
};

export default StaffDoubtCenterPage;
