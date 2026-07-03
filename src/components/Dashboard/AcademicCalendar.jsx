import React from "react";
import { GlassPanel } from "../ui/NeonUI";
import { FiCalendar, FiClock, FiVideo } from "react-icons/fi";

const AcademicCalendar = () => {
  return (
    <GlassPanel className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
         <h3 className="text-lg font-bold text-white flex items-center gap-2">
           <FiCalendar className="text-primary" />
           Up Next
         </h3>
      </div>

      <div className="space-y-4 flex-1">
        
        <div className="flex items-start gap-4">
           <div className="w-12 h-12 bg-[#0B0F19] border border-white/10 rounded-xl flex flex-col items-center justify-center shrink-0">
              <span className="text-[10px] text-primary font-bold uppercase">Oct</span>
              <span className="text-lg font-black text-white leading-none mt-0.5">24</span>
           </div>
           <div className="flex-1 bg-white/5 border border-white/5 p-3 rounded-xl hover:border-primary/30 transition-colors cursor-pointer">
              <h4 className="text-sm font-bold text-white mb-1">Live: Advanced Solidity</h4>
              <p className="text-xs text-slate-400 flex items-center gap-1"><FiClock /> 10:00 AM - 11:30 AM</p>
           </div>
        </div>

        <div className="flex items-start gap-4">
           <div className="w-12 h-12 bg-[#0B0F19] border border-white/10 rounded-xl flex flex-col items-center justify-center shrink-0">
              <span className="text-[10px] text-orange-500 font-bold uppercase">Oct</span>
              <span className="text-lg font-black text-white leading-none mt-0.5">26</span>
           </div>
           <div className="flex-1 bg-white/5 border border-white/5 p-3 rounded-xl hover:border-orange-500/30 transition-colors cursor-pointer">
              <h4 className="text-sm font-bold text-white mb-1">Project Submission</h4>
              <p className="text-xs text-slate-400 flex items-center gap-1 text-orange-400 font-semibold">Due in 2 days</p>
           </div>
        </div>

      </div>
    </GlassPanel>
  );
};

export default AcademicCalendar;
