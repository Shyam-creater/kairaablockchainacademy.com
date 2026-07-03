import React from "react";
import { FiShoppingBag, FiFileText, FiClock, FiShield } from "react-icons/fi";
import { format } from "timeago.js";

const ActivityFeed = ({ orders = [], registrations = [], logs = [], loading }) => {
  if (loading) {
    return (
      <div className="glass-panel p-6">
        <div className="h-6 w-40 bg-white/10 rounded animate-pulse mb-4" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-3 items-center mb-3">
            <div className="w-9 h-9 bg-gray-100 rounded-full animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-1">
              <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
              <div className="h-2 bg-gray-50 rounded animate-pulse w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Merge and sort by date desc
  const activities = [
    ...orders.slice(0, 5).map((o) => ({
      type: "order",
      id: o._id,
      label: `Purchase made`,
      sub: `Course ID: ${o.courseId?.slice(-6) ?? "—"}`,
      time: o.createdAt,
    })),
    ...registrations.slice(0, 5).map((r) => ({
      type: "registration",
      id: r._id,
      label: `${r.firstName || ""} ${r.lastName || ""} registered`,
      sub: r.course || "Course interest",
      time: r.createdAt,
    })),
    ...logs.slice(0, 5).map((l) => ({
      type: "log",
      id: l._id,
      label: `${l.actor?.name || "Admin"} performed action`,
      sub: l.action || "System action",
      time: l.createdAt,
    }))
  ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

  return (
    <div className="glass-panel p-6 w-full">
      <h3 className="text-base font-bold text-white mb-4 flex items-center justify-between">
        Recent Activity 
        <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-slate-300">Last 5 Actions</span>
      </h3>
      {activities.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-8">
          No recent activity
        </p>
      ) : (
        <ul className="space-y-3">
          {activities.map((item, i) => {
            const isOrder = item.type === "order";
            const isLog = item.type === "log";
            
            let Icon = FiFileText;
            let bgColor = "bg-primary/20 text-primary border border-primary/30 shadow-[0_0_10px_rgba(0,242,254,0.3)]";
            
            if (isOrder) {
              Icon = FiShoppingBag;
              bgColor = "bg-success/20 text-success border border-success/30 shadow-[0_0_10px_rgba(0,230,118,0.3)]";
            } else if (isLog) {
              Icon = FiShield;
              bgColor = "bg-accent/20 text-accent border border-accent/30 shadow-[0_0_10px_rgba(139,92,246,0.3)]";
            }
            
            return (
              <li key={item.id || i} className="flex items-start gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors">
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${bgColor}`}
                >
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-200 truncate">
                    {item.label}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">{item.sub}</p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-1 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                  <FiClock size={12} />
                  {item.time ? format(new Date(item.time)) : ""}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ActivityFeed;
