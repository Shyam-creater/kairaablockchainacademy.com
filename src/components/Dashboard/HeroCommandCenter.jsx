import React from "react";
import { GlassPanel } from "../ui/NeonUI";

const HeroCommandCenter = ({ user, metrics }) => {
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Good morning"
      : currentHour < 18
      ? "Good afternoon"
      : "Good evening";

  // Mock data for new premium features
  const streak = 14;
  const quote = "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.";
  const level = 24;
  const xp = 8450;
  const nextLevelXp = 10000;
  const xpPercentage = (xp / nextLevelXp) * 100;

  return (
    <GlassPanel glow="border-l-4 border-l-primary" className="p-8 relative overflow-hidden h-full flex flex-col justify-center">
      <div className="absolute right-[-10%] top-[-20%] w-64 h-64 bg-primary/20 blur-[80px] rounded-full pointer-events-none"></div>
      
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 relative z-10">
        <div className="flex items-center gap-6">
          {/* Avatar with Status Ring */}
          <div className="relative">
             <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-primary to-accent shadow-[0_0_20px_rgba(0,242,254,0.4)]">
                <img 
                   src={user?.avatar?.url || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&q=80"} 
                   alt="Avatar" 
                   className="w-full h-full rounded-full object-cover border-2 border-[#0B0F19]"
                />
             </div>
             <div className="absolute bottom-1 right-1 w-4 h-4 bg-[#00e676] border-2 border-[#0B0F19] rounded-full shadow-[0_0_10px_rgba(0,230,118,0.8)]"></div>
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-wide mb-1">
              {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent drop-shadow-[0_0_10px_rgba(0,242,254,0.3)]">{user?.name?.split(' ')[0] || 'Student'}!</span>
            </h2>
            <p className="text-slate-400 max-w-xl italic text-sm">"{quote}"</p>
          </div>
        </div>

        {/* Level & Streak Stats */}
        <div className="flex items-center gap-4 w-full xl:w-auto">
          
          <div className="flex-1 xl:flex-none bg-[#0B0F19]/80 p-4 rounded-2xl border border-white/10 shadow-inner flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 shadow-[0_0_15px_rgba(0,242,254,0.3)]">
              <span className="text-xl text-primary font-bold">L{level}</span>
            </div>
            <div className="flex-1 min-w-[120px]">
              <div className="flex justify-between items-end mb-1">
                 <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">EXP Progress</p>
                 <p className="text-[10px] text-primary font-bold">{xp} / {nextLevelXp}</p>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                 <div className="h-full bg-gradient-to-r from-primary to-accent shadow-[0_0_10px_rgba(0,242,254,0.8)]" style={{ width: `${xpPercentage}%`}}></div>
              </div>
            </div>
          </div>

          <div className="bg-[#0B0F19]/80 p-4 rounded-2xl border border-white/10 shadow-inner flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
              <span className="text-xl drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]">🔥</span>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Streak</p>
              <p className="text-2xl font-extrabold text-white leading-none">{streak}</p>
            </div>
          </div>

        </div>
      </div>
    </GlassPanel>
  );
};

export default HeroCommandCenter;
