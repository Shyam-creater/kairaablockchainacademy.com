import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlinePlus, HiOutlineDesktopComputer, HiOutlineFolderOpen, HiOutlineBadgeCheck, HiOutlineCalendar } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const actions = [
    { icon: <HiOutlineDesktopComputer className="w-5 h-5" />, label: "Live Learning Hub", color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", url: "/profile/meetings" },
    { icon: <HiOutlineFolderOpen className="w-5 h-5" />, label: "Session Resources", color: "text-secondary", bg: "bg-secondary/10", border: "border-secondary/20", url: "/profile/resources" },
    { icon: <HiOutlineBadgeCheck className="w-5 h-5" />, label: "Certificate Progress & Vault", color: "text-warning", bg: "bg-warning/10", border: "border-warning/20", url: "/profile/certificates" },
    { icon: <HiOutlineCalendar className="w-5 h-5" />, label: "Attendance", color: "text-success", bg: "bg-success/10", border: "border-success/20", url: "/profile/attendance" },
  ];

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-primary/80 to-purple-500/80 hover:from-primary hover:to-purple-500 text-white shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50 relative z-10 overflow-hidden group">
        <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }}>
          <HiOutlinePlus className="w-6 h-6" />
        </motion.div>
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-3 w-64 z-50 p-3 rounded-xl bg-[#111827]/95 backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
          >
            <div className="px-2 py-1 mb-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Actions</h4>
            </div>
            <div className="flex flex-col gap-1">
              {actions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => { setIsOpen(false); navigate(action.url); }}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group text-left w-full"
                >
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center ${action.bg} ${action.color} border ${action.border} group-hover:scale-110 transition-transform`}>
                    {action.icon}
                  </div>
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuickActions;
