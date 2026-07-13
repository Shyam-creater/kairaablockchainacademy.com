import React from 'react';

const XPWidget = ({ level = 12, currentXP = 2450, nextLevelXP = 3000, totalHours = 48 }) => {
  const progressPercent = Math.round((currentXP / nextLevelXP) * 100);
  
  return (
    <div className="p-5 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-2xl border border-primary/20">
       <div className="flex justify-between items-center mb-3">
          <span className="font-extrabold text-white text-lg">Level {level}</span>
          <span className="text-xs font-bold text-slate-300 bg-black/40 px-2 py-1 rounded-full">{nextLevelXP} XP</span>
       </div>
       <div className="w-full bg-black/50 h-2.5 rounded-full mb-3 border border-white/5 overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-accent h-2.5 rounded-full shadow-[0_0_10px_rgba(0,242,254,0.5)]" style={{ width: `${progressPercent}%` }}></div>
       </div>
       <p className="text-xs text-slate-400">
         Earn <span className="text-white font-bold">{nextLevelXP - currentXP} XP</span> to reach Level {level + 1}
       </p>
       
       <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
         <span className="text-xs text-slate-400">Learning Time</span>
         <span className="text-sm text-white font-bold">{totalHours}h</span>
       </div>
    </div>
  );
};

export default XPWidget;
