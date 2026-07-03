import React from "react";
import { motion } from "framer-motion";

export const GlassPanel = ({ children, className = "", glow = "" }) => (
  <div className={`bg-[#0B0F19]/60 backdrop-blur-xl border border-white/10 rounded-2xl relative overflow-hidden ${glow} ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
    <div className="relative z-10">{children}</div>
  </div>
);

export const NeonButton = ({ children, onClick, variant = "primary", className = "", ...props }) => {
  const variants = {
    primary: "bg-primary/20 text-primary border border-primary/50 hover:bg-primary hover:text-slate-900 hover:shadow-[0_0_20px_rgba(0,242,254,0.4)]",
    secondary: "bg-accent/20 text-accent border border-accent/50 hover:bg-accent hover:text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]",
    ghost: "bg-transparent text-slate-300 hover:text-white hover:bg-white/5 border border-transparent",
    danger: "bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500 hover:text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`px-4 py-2 rounded-xl font-bold transition-all duration-300 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export const NeonBadge = ({ children, color = "primary", className = "" }) => {
  const colors = {
    primary: "bg-primary/10 text-primary border-primary/30",
    success: "bg-[#00e676]/10 text-[#00e676] border-[#00e676]/30",
    warning: "bg-amber-500/10 text-amber-500 border-amber-500/30",
    danger: "bg-red-500/10 text-red-500 border-red-500/30",
    accent: "bg-accent/10 text-accent border-accent/30"
  };
  
  return (
    <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full border ${colors[color]} ${className}`}>
      {children}
    </span>
  );
};
