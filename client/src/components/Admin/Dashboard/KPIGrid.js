import React from "react";
import { FiUsers, FiShoppingCart, FiDollarSign, FiBookOpen, FiActivity, FiClipboard } from "react-icons/fi";
import { motion } from "framer-motion";

const icons = {
  users: { icon: FiUsers, color: "text-primary", hex: "#00f2fe", glow: "hover:shadow-[0_0_20px_rgba(0,242,254,0.3)]" },
  active: { icon: FiActivity, color: "text-success", hex: "#00e676", glow: "hover:shadow-[0_0_20px_rgba(0,230,118,0.3)]" },
  courses: { icon: FiBookOpen, color: "text-accent", hex: "#8b5cf6", glow: "hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]" },
  orders: { icon: FiShoppingCart, color: "text-warning", hex: "#ffb300", glow: "hover:shadow-[0_0_20px_rgba(255,179,0,0.3)]" },
  revenue: { icon: FiDollarSign, color: "text-secondary", hex: "#fe0979", glow: "hover:shadow-[0_0_20px_rgba(254,9,121,0.3)]" },
  registrations: { icon: FiClipboard, color: "text-info", hex: "#2979ff", glow: "hover:shadow-[0_0_20px_rgba(41,121,255,0.3)]" },
};

const KPICard = ({ label, value, sub, iconKey, delay }) => {
  const { icon: Icon, color, hex, glow } = icons[iconKey] || icons.users;
  
  // Calculate a deterministic percentage based on the label for visual purposes
  const percentage = Math.min(Math.max((label.length * 10) % 100, 40), 90);
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: delay }}
      className={`glass-panel p-6 flex items-center gap-5 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group ${glow}`}
    >
      {/* Subtle Premium Shimmer */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)`,
          transform: "skewX(-20deg)",
        }}
        animate={{ 
          left: ["-100%", "200%"],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 5 }}
      />
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none group-hover:bg-white/10 transition-all duration-500"></div>
      
      <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-lg" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="none" />
          <motion.circle 
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, delay: delay + 0.2, ease: "easeOut" }}
            cx="40" cy="40" r={radius} 
            stroke={hex} 
            strokeWidth="6" 
            fill="none" 
            strokeDasharray={circumference} 
            strokeLinecap="round" 
            style={{ filter: `drop-shadow(0 0 6px ${hex}80)` }}
          />
        </svg>
        <div className={`p-3 rounded-full bg-white/5 border border-slate-600 flex items-center justify-center ${color} shadow-inner`}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
      </div>

      <div className="flex-1 relative z-10">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">{label}</span>
        <h3 className="text-2xl font-extrabold text-white tracking-tight leading-none mb-1 drop-shadow-md">{value ?? "—"}</h3>
        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{sub}</p>
      </div>
    </motion.div>
  );
};

const KPIGrid = ({ summary, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 xl:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass-panel h-[140px] animate-pulse border border-white/5" />
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: "Total Users",
      value: summary?.users?.total?.toLocaleString(),
      sub: `+${summary?.users?.newToday ?? 0} today`,
      iconKey: "users",
    },
    {
      label: "Active (30d)",
      value: summary?.users?.active30d?.toLocaleString(),
      sub: `${summary?.users?.active7d ?? 0} last 7 days`,
      iconKey: "active",
    },
    {
      label: "Courses",
      value: summary?.courses?.total?.toLocaleString(),
      sub: "Live on platform",
      iconKey: "courses",
    },
    {
      label: "Course Registrations",
      value: summary?.registrations?.total?.toLocaleString(),
      sub: "Interested learners",
      iconKey: "registrations",
    },
    {
      label: "Purchases",
      value: summary?.orders?.total?.toLocaleString(),
      sub: "Enrolled learners",
      iconKey: "orders",
    },
    {
      label: "Total Revenue",
      value: `₹${(summary?.orders?.totalRevenue ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
      sub: `₹${(summary?.orders?.monthlyRevenue ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })} this month`,
      iconKey: "revenue",
    },

  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 xl:gap-6">
      {cards.map((card, idx) => (
        <KPICard key={card.label} {...card} delay={idx * 0.05} />
      ))}
    </div>
  );
};

export default KPIGrid;
