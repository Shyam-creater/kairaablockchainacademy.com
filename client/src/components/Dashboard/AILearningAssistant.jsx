import React from "react";
import { GlassPanel, NeonButton } from "../ui/NeonUI";
import { FiCpu, FiTarget, FiTrendingUp } from "react-icons/fi";

const AILearningAssistant = () => {
  return (
    <GlassPanel glow="border-t-2 border-t-[#00e676]" className="p-6 relative overflow-hidden h-full">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <FiCpu size={120} className="text-[#00e676]" />
      </div>
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-[#00e676]/20 flex items-center justify-center border border-[#00e676]/50 shadow-[0_0_15px_rgba(0,230,118,0.3)]">
          <FiCpu className="text-[#00e676] text-xl" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">AI Assistant</h3>
          <p className="text-[10px] font-bold text-[#00e676] uppercase tracking-widest animate-pulse">Online & Analyzing</p>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        <div className="bg-[#0B0F19]/50 border border-white/5 p-4 rounded-xl hover:border-[#00e676]/30 transition-colors">
          <div className="flex items-start gap-3">
            <FiTarget className="text-orange-400 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Focus Recommended</h4>
              <p className="text-xs text-slate-400">You struggled with "Smart Contract Security" in your last quiz. Recommend re-watching Lesson 4.</p>
            </div>
          </div>
        </div>

        <div className="bg-[#0B0F19]/50 border border-white/5 p-4 rounded-xl hover:border-[#00e676]/30 transition-colors">
          <div className="flex items-start gap-3">
            <FiTrendingUp className="text-primary mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Learning Velocity</h4>
              <p className="text-xs text-slate-400">You are learning 15% faster than your peers. Keep up the momentum!</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 relative z-10">
         <NeonButton variant="ghost" className="w-full text-xs py-2 border-[#00e676]/30 text-[#00e676] hover:bg-[#00e676]/10">
            Generate Study Schedule
         </NeonButton>
      </div>
    </GlassPanel>
  );
};

export default AILearningAssistant;
