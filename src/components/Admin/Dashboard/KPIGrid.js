import React from "react";
import { FiUsers, FiShoppingCart, FiDollarSign, FiBookOpen, FiActivity, FiClipboard } from "react-icons/fi";
import { motion } from "framer-motion";

const icons = {
  users: { icon: FiUsers, color: "text-primary", bg: "bg-primary-50", border: "border-primary/10" },
  active: { icon: FiActivity, color: "text-success", bg: "bg-success-50", border: "border-success/10" },
  courses: { icon: FiBookOpen, color: "text-accent", bg: "bg-accent-50", border: "border-accent/10" },
  orders: { icon: FiShoppingCart, color: "text-warning", bg: "bg-warning-50", border: "border-warning/10" },
  revenue: { icon: FiDollarSign, color: "text-danger", bg: "bg-danger-50", border: "border-danger/10" },
  registrations: { icon: FiClipboard, color: "text-secondary", bg: "bg-secondary-50", border: "border-secondary/10" },
};

const KPICard = ({ label, value, sub, iconKey, delay }) => {
  const { icon: Icon, color, bg, border } = icons[iconKey] || icons.users;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay }}
      className="bg-white border border-gray-100 p-5 flex flex-col justify-between hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group"
    >
      <div className="flex justify-between items-start mb-4">
        <span className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
        <div className={`p-2 rounded-none ${bg} ${color} ${border} border flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={18} strokeWidth={2.5} />
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-bold text-gray-900 tracking-tight leading-none mb-2">{value ?? "—"}</h3>
        <p className="text-[13px] font-medium text-gray-400">{sub}</p>
      </div>
    </motion.div>
  );
};

const KPIGrid = ({ summary, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 xl:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-gray-50 h-[140px] animate-pulse border border-gray-100" />
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
      label: "Course Purchases",
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 xl:gap-6">
      {cards.map((card, idx) => (
        <KPICard key={card.label} {...card} delay={idx * 0.05} />
      ))}
    </div>
  );
};

export default KPIGrid;
