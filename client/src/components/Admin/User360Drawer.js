import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiUser, FiActivity, FiFileText, FiAward, FiClock } from "react-icons/fi";
import { useGetUserProfile360Query } from "../../redux/features/admin/adminApi.js";
import Loader from "../Loader/Loader";
import { format } from "timeago.js";

const User360Drawer = ({ isOpen, onClose, userId, onUpdateRole }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedRole, setSelectedRole] = useState("");
  const { data, isLoading } = useGetUserProfile360Query(userId, { skip: !userId || !isOpen });

  const profile = data?.profile;
  const user = profile?.user;

  // Initialize selected role when user loads
  React.useEffect(() => {
    if (user?.role) setSelectedRole(user.role);
  }, [user]);

  const tabs = [
    { id: "overview", label: "Overview", icon: FiUser },
    { id: "timeline", label: "Timeline", icon: FiActivity },
    { id: "notes", label: "Notes", icon: FiFileText }
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
                User 360° Profile
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
                  {/* User Basic Info Header */}
                  <div className="flex items-center gap-4 glass-panel p-5 relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
                    <img 
                      src={user?.avatar?.url || `https://ui-avatars.com/api/?name=${user?.name || "User"}&background=random`} 
                      alt="Avatar" 
                      className="w-16 h-16 rounded-full object-cover border-2 border-primary/30"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-white">{user?.name}</h3>
                      <p className="text-sm text-slate-400">{user?.email}</p>
                      <div className="flex gap-2 mt-2">
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md ${user?.isSuspended ? 'bg-danger/20 text-danger border border-danger/30 shadow-[0_0_10px_rgba(255,59,48,0.2)]' : 'bg-success/20 text-success border border-success/30 shadow-[0_0_10px_rgba(0,230,118,0.2)]'}`}>
                          {user?.isSuspended ? 'Suspended' : 'Active'}
                        </span>
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-primary/20 text-primary border border-primary/30 shadow-[0_0_10px_rgba(0,242,254,0.2)]`}>
                          {user?.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Role Change Option in Overview Section */}
                  {onUpdateRole && (
                    <div className="glass-panel p-4 flex items-center justify-between mt-2 border border-primary/20">
                      <div>
                        <h4 className="text-sm font-bold text-white">Change User Role</h4>
                        <p className="text-xs text-slate-400 mt-1">Assign admin or staff privileges</p>
                      </div>
                      <div className="flex gap-2">
                        <select
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value)}
                          className="h-[35px] border border-slate-600 bg-surface/80 text-white text-xs outline-none px-3 focus:border-primary/50 focus:shadow-[0_0_10px_rgba(0,242,254,0.3)] transition-all cursor-pointer rounded-lg"
                        >
                          <option className="bg-surface text-white" value="user">User</option>
                          <option className="bg-surface text-white" value="staff">Staff</option>
                          <option className="bg-surface text-white" value="admin">Admin</option>
                        </select>
                        <button
                          onClick={() => {
                            if (selectedRole !== user?.role) {
                              onUpdateRole({ email: user.email, role: selectedRole });
                            }
                          }}
                          disabled={selectedRole === user?.role}
                          className={`text-xs px-4 py-1.5 rounded-lg font-bold uppercase tracking-wider transition-all border ${
                            selectedRole !== user?.role 
                              ? "bg-primary/20 text-primary border-primary/50 shadow-[0_0_10px_rgba(0,242,254,0.2)] hover:bg-primary hover:text-slate-900 cursor-pointer" 
                              : "bg-transparent border-transparent text-slate-500 cursor-not-allowed opacity-50"
                          }`}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  )}

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
                            <p className="text-xs text-slate-400 uppercase">Health Score</p>
                            <p className={`text-xl font-bold mt-1 ${user?.healthScore < 50 ? 'text-danger' : user?.healthScore < 80 ? 'text-warning' : 'text-success'}`}>
                              {user?.healthScore || 0}/100
                            </p>
                          </div>
                          <div className="glass-panel p-4 flex flex-col items-center justify-center relative overflow-hidden group hover:border-primary/50 transition-all">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold z-10">Risk Status</p>
                            <p className="text-lg font-bold mt-1 text-white drop-shadow-md z-10">{user?.riskStatus || 'Active'}</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-white mb-2">Purchased Courses ({profile.orders?.length || 0})</h4>
                          <div className="space-y-3">
                            {profile.orders?.map(order => (
                              <div key={order._id} className="glass-panel p-3 flex justify-between items-center hover:border-primary/30 transition-colors">
                                <div>
                                  <p className="text-sm text-slate-200">{order.courseId?.name || "Unknown Course"}</p>
                                  <p className="text-xs text-slate-500">Purchased {format(order.createdAt)}</p>
                                </div>
                                <span className="text-primary font-bold">₹{order.courseId?.price || 0}</span>
                              </div>
                            ))}
                            {(!profile.orders || profile.orders.length === 0) && (
                              <p className="text-sm text-slate-500 italic">No courses purchased yet.</p>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-bold text-white mb-2">Tags</h4>
                          <div className="flex flex-wrap gap-2">
                            {user?.tags?.map((tag, i) => (
                              <span key={i} className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded border border-secondary/30">
                                {tag}
                              </span>
                            ))}
                            {(!user?.tags || user?.tags.length === 0) && (
                              <p className="text-sm text-slate-500 italic">No tags assigned.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TIMELINE TAB */}
                    {activeTab === "timeline" && (
                      <div className="space-y-4">
                        {profile.activity?.map((act, i) => (
                          <div key={act._id} className="relative pl-6 pb-4 border-l border-white/10 last:border-0 last:pb-0">
                            <div className="absolute left-[-5px] top-1 w-[9px] h-[9px] rounded-full bg-primary shadow-[0_0_8px_rgba(0,242,254,0.8)]"></div>
                            <p className="text-sm text-white font-medium">{act.action.replace(/_/g, " ")}</p>
                            <p className="text-xs text-slate-400 mt-1">{format(act.createdAt)}</p>
                            {act.ipAddress && <p className="text-[10px] text-slate-500 mt-1">IP: {act.ipAddress}</p>}
                          </div>
                        ))}
                        {(!profile.activity || profile.activity.length === 0) && (
                          <p className="text-sm text-slate-500 italic">No recent activity.</p>
                        )}
                      </div>
                    )}

                    {/* NOTES TAB */}
                    {activeTab === "notes" && (
                      <div className="space-y-4 relative">
                        {/* Timeline line */}
                        <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10"></div>
                        {profile.notes?.map(note => (
                          <div key={note._id} className="glass-panel p-4 ml-10 relative">
                            {/* Dot */}
                            <div className="absolute -left-[29px] top-5 w-3 h-3 rounded-full bg-secondary shadow-[0_0_10px_rgba(197,101,249,0.8)] border-2 border-slate-900"></div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-bold text-primary">{note.adminId?.name || "Admin"}</span>
                              <span className="text-[10px] text-slate-500">{format(note.createdAt)}</span>
                            </div>
                            <p className="text-sm text-slate-300 whitespace-pre-wrap">{note.note}</p>
                          </div>
                        ))}
                        {(!profile.notes || profile.notes.length === 0) && (
                          <p className="text-sm text-slate-500 italic">No internal notes for this user.</p>
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

export default User360Drawer;
