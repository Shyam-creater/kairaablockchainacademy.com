import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StreakWidget = ({ currentStreak = 0, bestStreak = 0, weeklyProgress = [false, false, false, false, false, false, false] }) => {
  const [isHovered, setIsHovered] = useState(false);
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-orange-500/30 hover:border-orange-500/60 hover:bg-orange-500/10 transition-all group">
        <span className="text-xl group-hover:scale-110 transition-transform origin-bottom">🔥</span>
        <span className="text-sm font-bold text-slate-200 group-hover:text-white">{currentStreak} Day Streak</span>
      </button>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-3 w-64 z-50 p-4 rounded-xl bg-[#111827]/95 backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-white">Learning Streak</h4>
              <span className="text-xs font-medium text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded-full">Top 5%</span>
            </div>
            
            <div className="flex gap-4 mb-4">
              <div className="flex-1 bg-white/5 rounded-lg p-2 text-center border border-white/5">
                <p className="text-xs text-slate-400 mb-1">Current</p>
                <p className="text-lg font-bold text-white flex items-center justify-center gap-1">
                  <span className="text-orange-500">🔥</span> {currentStreak}
                </p>
              </div>
              <div className="flex-1 bg-white/5 rounded-lg p-2 text-center border border-white/5">
                <p className="text-xs text-slate-400 mb-1">Best</p>
                <p className="text-lg font-bold text-slate-300">{bestStreak}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-slate-400 font-medium">This Week</p>
              <div className="flex justify-between">
                {weeklyProgress.map((completed, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${completed ? 'bg-orange-500 text-white shadow-[0_0_10px_rgba(249,115,22,0.4)]' : 'bg-white/10 text-slate-500'}`}>
                      {completed ? '✓' : ''}
                    </div>
                    <span className="text-[10px] text-slate-500">{days[idx]}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StreakWidget;
