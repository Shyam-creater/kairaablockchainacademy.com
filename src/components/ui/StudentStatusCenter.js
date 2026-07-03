import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineLightningBolt } from 'react-icons/hi';

const StudentStatusCenter = ({ courseName = "Blockchain Fundamentals", progress = 75, streak = 18 }) => {
  return (
    <div className="hidden xl:flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-primary/30 transition-colors">
      {/* Online Status */}
      <div className="flex items-center gap-1.5 border-r border-white/10 pr-3">
        <div className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success shadow-[0_0_8px_rgba(0,230,118,0.8)]"></span>
        </div>
       
      </div>

      {/* Current Course Progress */}
      <div className="flex items-center gap-3 border-r border-white/10 pr-3 min-w-[180px]">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-slate-400 uppercase tracking-wide truncate">Current Course</p>
          <p className="text-xs font-medium text-slate-200 truncate group-hover:text-primary transition-colors cursor-pointer hover:underline">
            {courseName}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs font-bold text-primary">{progress}%</span>
          <div className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-primary rounded-full shadow-[0_0_5px_rgba(0,242,254,0.5)]"
            />
          </div>
        </div>
      </div>

      {/* Mini Streak */}
      <div className="flex items-center gap-1.5 pl-1">
        <HiOutlineLightningBolt className="w-4 h-4 text-orange-500" />
        <span className="text-xs font-bold text-slate-200">{streak}</span>
      </div>
    </div>
  );
};

export default StudentStatusCenter;
