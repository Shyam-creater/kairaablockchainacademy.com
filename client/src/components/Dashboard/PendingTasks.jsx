import React from "react";
import { GlassPanel } from "../ui/NeonUI";
import { FiTarget, FiCheckCircle, FiClock } from "react-icons/fi";

const PendingTasks = ({ pendingAssignments = [] }) => {
  return (
    <GlassPanel className="p-6 h-full flex flex-col border-t-2 border-t-yellow-500">
      <div className="flex justify-between items-center mb-6">
         <h3 className="text-lg font-bold text-white flex items-center gap-2">
           <FiTarget className="text-yellow-400" />
           Pending Tasks
         </h3>
      </div>

      <div className="space-y-4 flex-1">
        {pendingAssignments.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
               <FiCheckCircle size={32} className="text-[#00e676]" />
               <p className="text-sm font-semibold">You're all caught up!</p>
           </div>
        ) : (
            pendingAssignments.map((task, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5 relative overflow-hidden group hover:border-yellow-500/30 transition-colors">
                    <div className="w-10 h-10 flex items-center justify-center bg-yellow-500/10 rounded-full border border-yellow-500/20 text-yellow-500">
                        <FiClock />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white mb-0.5">{task.title}</h4>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest truncate max-w-[150px]">{task.description}</p>
                    </div>
                </div>
            ))
        )}
      </div>
    </GlassPanel>
  );
};

export default PendingTasks;
