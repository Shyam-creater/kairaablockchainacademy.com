import React from "react";
import { GlassPanel } from "../ui/NeonUI";
import { FiClock, FiCheckCircle, FiAward, FiBookOpen } from "react-icons/fi";

const QuickStats = ({ metrics, courses }) => {
  const stats = [
    {
      title: "Enrolled Courses",
      value: courses?.length || 0,
      icon: <FiBookOpen size={24} />,
      color: "primary",
      bgClass: "bg-primary/10",
      textClass: "text-primary",
      borderClass: "border-primary/20 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(0,242,254,0.3)]",
    },
    {
      title: "Completed Lessons",
      value: metrics?.completedLessons || 0,
      icon: <FiCheckCircle size={24} />,
      color: "emerald",
      bgClass: "bg-[#00e676]/10",
      textClass: "text-[#00e676]",
      borderClass: "border-[#00e676]/20 hover:border-[#00e676]/50 hover:shadow-[0_0_20px_rgba(0,230,118,0.3)]",
    },
    {
      title: "Learning Hours",
      value: `${metrics?.learningHours || 0}h`,
      icon: <FiClock size={24} />,
      color: "accent",
      bgClass: "bg-accent/10",
      textClass: "text-accent",
      borderClass: "border-accent/20 hover:border-accent/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]",
    },
    {
      title: "Global Rank",
      value: `#${metrics?.rank || "-"}`,
      icon: <FiAward size={24} />,
      color: "yellow",
      bgClass: "bg-yellow-500/10",
      textClass: "text-yellow-400",
      borderClass: "border-yellow-500/20 hover:border-yellow-500/50 hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]",
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 h-full">
      {stats.map((stat, idx) => (
        <GlassPanel 
          key={idx} 
          className={`p-6 flex flex-col items-center justify-center text-center group transition-all duration-300 border ${stat.borderClass}`}
        >
          <div className={`w-14 h-14 rounded-full ${stat.bgClass} ${stat.textClass} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
            {stat.icon}
          </div>
          <h3 className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1">{stat.title}</h3>
          <p className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow-md">{stat.value}</p>
        </GlassPanel>
      ))}
    </div>
  );
};

export default QuickStats;
