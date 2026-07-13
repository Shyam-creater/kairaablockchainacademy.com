import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiUser, FiBookOpen, FiActivity } from "react-icons/fi";
import { useGetStaffProfile360Query } from "../../../redux/features/admin/adminApi.js";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";

const Staff360Drawer = ({ isOpen, onClose, staffId }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const { data, isLoading } = useGetStaffProfile360Query(staffId, { skip: !staffId || !isOpen });

  const profile = data?.profile;
  const staff = profile?.staffInfo;

  const tabs = [
    { id: "overview", label: "Overview", icon: FiUser },
    { id: "students", label: "Assigned Students", icon: FiBookOpen },
    { id: "activity", label: "Recent Logs", icon: FiActivity },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-slate-900/80 backdrop-blur-xl border-l border-white/10 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5 backdrop-blur-md">
              <h2 className="text-xl font-bold flex items-center gap-2 text-gradient">
                Staff 360° Profile
              </h2>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-y-auto">
              {isLoading || !profile ? (
                <div className="flex justify-center items-center h-64">
                  <Loader />
                </div>
              ) : (
                <div className="p-6 space-y-6">
                  {/* Staff Basic Info Header */}
                  <div className="flex items-center gap-4 glass-panel p-5 relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
                    <img 
                      src={staff?.avatar?.url || `https://ui-avatars.com/api/?name=${staff?.name || "Staff"}&background=random`} 
                      alt="Avatar" 
                      className="w-16 h-16 rounded-full object-cover border-2 border-primary/30"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-white">{staff?.name}</h3>
                      <p className="text-sm text-slate-400">{staff?.email}</p>
                      <div className="flex gap-2 mt-2">
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md ${staff?.isSuspended ? 'bg-danger/20 text-danger border border-danger/30 shadow-[0_0_10px_rgba(255,59,48,0.2)]' : 'bg-success/20 text-success border border-success/30 shadow-[0_0_10px_rgba(0,230,118,0.2)]'}`}>
                          {staff?.isSuspended ? 'Suspended' : 'Active'}
                        </span>
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-primary/20 text-primary border border-primary/30 shadow-[0_0_10px_rgba(0,242,254,0.2)]`}>
                          {staff?.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex gap-1 border-b border-white/10 pb-1 overflow-x-auto no-scrollbar">
                    {tabs.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-colors whitespace-nowrap ${
                          activeTab === tab.id 
                            ? "bg-white/10 text-primary border-b-2 border-primary" 
                            : "text-slate-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <tab.icon size={14} />
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <div className="mt-4">
                    {/* OVERVIEW TAB */}
                    {activeTab === "overview" && (
                      <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="glass-panel p-4 flex flex-col items-center justify-center relative overflow-hidden group hover:border-primary/50 transition-all">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold z-10">Caseload</p>
                            <p className={`text-xl font-bold mt-1 text-primary drop-shadow-md z-10`}>
                              {profile.caseload}
                            </p>
                          </div>
                          <div className="glass-panel p-4 flex flex-col items-center justify-center relative overflow-hidden group hover:border-primary/50 transition-all">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold z-10">Status</p>
                            <p className="text-lg font-bold mt-1 text-white drop-shadow-md z-10">{staff?.isSuspended ? 'Offline' : 'Online'}</p>
                          </div>
                        </div>
                        {/* INVOLVEMENT SECTION MERGED INTO OVERVIEW */}
                        {profile.involvement && (
                          <div className="space-y-5 pt-2">
                            <div className="glass-panel p-5 relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-24 h-24 bg-success/10 rounded-full blur-2xl"></div>
                              <h4 className="text-sm font-bold text-white mb-4 relative z-10">Student Progress Engine</h4>
                              <div className="grid grid-cols-2 gap-4 relative z-10">
                                <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Total Lessons Completed</p>
                                  <p className="text-lg font-extrabold text-success mt-1">{profile.involvement.totalCompletedLessons}</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Avg Lessons / Student</p>
                                  <p className="text-lg font-extrabold text-primary mt-1">{profile.involvement.avgLessonsPerStudent}</p>
                                </div>
                              </div>
                            </div>

                            <div className="glass-panel p-5 relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-24 h-24 bg-warning/10 rounded-full blur-2xl"></div>
                              <h4 className="text-sm font-bold text-white mb-4 relative z-10">Grading & Feedback</h4>
                              <div className="grid grid-cols-2 gap-4 relative z-10">
                                <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Pending Assignments</p>
                                  <p className="text-lg font-extrabold text-warning mt-1">{profile.involvement.pendingAssignments}</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Reviewed Assignments</p>
                                  <p className="text-lg font-extrabold text-secondary mt-1">{profile.involvement.reviewedAssignments}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ASSIGNED STUDENTS TAB */}
                    {activeTab === "students" && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-bold text-white mb-2">Assigned Students ({profile.studentsAssigned?.length || 0})</h4>
                        {profile.studentsAssigned?.map(order => (
                          <div key={order._id} className="glass-panel p-3 flex justify-between items-center hover:border-primary/30 transition-colors">
                            <div className="flex items-center gap-3">
                              <img 
                                src={order.student?.avatar?.url || `https://ui-avatars.com/api/?name=${order.student?.name || "User"}&background=random`} 
                                alt="Student"
                                className="w-8 h-8 rounded-full"
                              />
                              <div>
                                <p className="text-sm text-slate-200">{order.student?.name || "Unknown Student"}</p>
                                <p className="text-xs text-slate-500">{order.courseId?.name || "Unknown Course"}</p>
                              </div>
                            </div>
                            <span className="text-[10px] text-slate-400">Assigned {format(order.updatedAt)}</span>
                          </div>
                        ))}
                        {(!profile.studentsAssigned || profile.studentsAssigned.length === 0) && (
                          <p className="text-sm text-slate-500 italic">No students assigned yet.</p>
                        )}
                      </div>
                    )}

                    {/* ACTIVITY TAB */}
                    {activeTab === "activity" && (
                      <div className="space-y-4">
                        {profile.recentActivity?.map((act, i) => (
                          <div key={act._id} className="relative pl-6 pb-4 border-l border-white/10 last:border-0 last:pb-0">
                            <div className="absolute left-[-5px] top-1 w-[9px] h-[9px] rounded-full bg-primary shadow-[0_0_8px_rgba(0,242,254,0.8)]"></div>
                            <p className="text-sm text-white font-medium">{act.action.replace(/_/g, " ")}</p>
                            <p className="text-xs text-slate-400 mt-1">{format(act.createdAt)}</p>
                            <p className="text-[10px] text-slate-500 mt-1">Target: {act.target}</p>
                          </div>
                        ))}
                        {(!profile.recentActivity || profile.recentActivity.length === 0) && (
                          <p className="text-sm text-slate-500 italic">No recent admin activity.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Staff360Drawer;
