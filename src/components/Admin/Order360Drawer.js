import React, { useState, useEffect } from "react";
import { Drawer, Box, Tooltip } from "@mui/material";
import { FiX, FiDownload, FiUser, FiBook, FiDollarSign, FiClock, FiCheckCircle, FiCheck } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const Order360Drawer = ({ order, open, onClose, staffMembers = [], userRole = "admin", onAssignStaff, assignLoading }) => {
  const [selectedStaff, setSelectedStaff] = useState("");

  useEffect(() => {
    if (order) {
      setSelectedStaff(order.assignedStaffId?._id || "");
    }
  }, [order]);

  if (!order) return null;

  const originalStaffId = order.assignedStaffId?._id || "";
  const hasChanged = selectedStaff !== originalStaffId;

  const handleSave = () => {
    if (hasChanged) {
      onAssignStaff(order.id, selectedStaff);
    }
  };

  // Helper to get initials
  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: "450px" },
          background: "transparent",
          backdropFilter: "blur(20px)",
        },
      }}
    >
      <Box className="h-full bg-[#111C43]/90 border-l border-white/10 flex flex-col relative overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 p-6 flex items-center justify-between border-b border-white/10 bg-[#111C43]/95 backdrop-blur-md">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Order Details
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="p-6 space-y-8 flex-1">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Payment Status
            </span>
            <div className="px-3 py-1 bg-success/20 text-success border border-success/30 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,230,118,0.2)]">
              <FiCheckCircle size={14} /> Confirmed
            </div>
          </div>

          {/* User Profile Card */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-xl font-bold shadow-[0_0_15px_rgba(0,242,254,0.3)] overflow-hidden">
                {order.userAvatar ? (
                  <img src={order.userAvatar} alt={order.userName} className="w-full h-full object-cover" />
                ) : (
                  order.userName ? order.userName.charAt(0).toUpperCase() : <FiUser />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white leading-tight">
                  {order.userName || "Unknown User"}
                </h3>
                <p className="text-sm text-slate-400 truncate w-[200px]">
                  {order.userEmail || order.userId}
                </p>
              </div>
            </div>
          </div>

          {/* Course Details */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <FiBook /> Purchased Item
            </h4>
            <div className="bg-black/20 border border-slate-600 rounded-xl p-4">
              <h3 className="text-white font-bold mb-1">{order.courseName || order.courseId}</h3>
              <p className="text-sm text-primary font-bold">
                ₹{order.coursePrice?.toLocaleString() || (order.amount ? order.amount : "—")}
              </p>
            </div>
          </div>

          {/* Payment Details */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <FiDollarSign /> Transaction Info
            </h4>
            <div className="bg-black/20 border border-slate-600 rounded-xl p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Order ID</span>
                <span className="text-sm font-mono text-white">{order.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Payment ID</span>
                <span className="text-sm font-mono text-primary truncate max-w-[150px]">{order.paymentId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Date</span>
                <span className="text-sm text-white flex items-center gap-1">
                  <FiClock size={12} className="text-slate-400" /> {order.created_at}
                </span>
              </div>
            </div>
          </div>

          {/* Innovative Staff Assignment UI */}
          {userRole !== "staff" && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <FiUser /> Smart Assignment
              </h4>
              <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                
                <p className="text-xs text-slate-400">Select a staff member to take ownership of this student.</p>
                
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide relative z-10">
                  {/* Unassigned Option */}
                  <Tooltip title="Unassigned" arrow placement="top">
                    <button
                      onClick={() => setSelectedStaff("")}
                      className={`relative w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center border-2 transition-all ${
                        selectedStaff === "" 
                          ? "border-slate-400 bg-slate-800 text-white" 
                          : "border-transparent bg-white/5 text-slate-400 hover:bg-white/10"
                      }`}
                    >
                      <FiX size={18} />
                      {selectedStaff === "" && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-slate-400 rounded-full flex items-center justify-center border border-[#111C43]">
                          <FiCheck size={10} className="text-[#111C43]" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  </Tooltip>

                  {/* Staff Options */}
                  {staffMembers.map((staff) => {
                    const isSelected = selectedStaff === staff._id;
                    const isOriginal = originalStaffId === staff._id;
                    return (
                      <Tooltip key={staff._id} title={staff.name} arrow placement="top">
                        <button
                          onClick={() => setSelectedStaff(staff._id)}
                          className={`relative w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center border-2 transition-all font-bold ${
                            isSelected 
                              ? "border-primary bg-primary/20 text-primary shadow-[0_0_15px_rgba(0,242,254,0.3)]" 
                              : isOriginal
                                ? "border-success/50 bg-success/10 text-success"
                                : "border-transparent bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          {getInitials(staff.name)}
                          {isSelected && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center border border-[#111C43]">
                              <FiCheck size={10} className="text-[#111C43]" strokeWidth={3} />
                            </div>
                          )}
                        </button>
                      </Tooltip>
                    );
                  })}
                </div>

                {/* Animated Confirmation Button */}
                <AnimatePresence>
                  {hasChanged && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="overflow-hidden"
                    >
                      <button
                        onClick={handleSave}
                        disabled={assignLoading}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-slate-900 font-bold uppercase tracking-wider hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(0,242,254,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {assignLoading ? (
                          <span className="animate-pulse">Confirming...</span>
                        ) : (
                          <>
                            <FiCheckCircle size={18} />
                            Confirm Assignment
                          </>
                        )}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/10 bg-[#111C43]/95 backdrop-blur-md">
          <button 
            onClick={() => window.print()} 
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-slate-600 text-white font-bold uppercase tracking-wider hover:bg-white/10 transition-all"
          >
            <FiDownload size={18} /> Download Receipt
          </button>
        </div>
      </Box>
    </Drawer>
  );
};

export default Order360Drawer;
