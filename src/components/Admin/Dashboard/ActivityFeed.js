import React from "react";
import { FiShoppingBag, FiFileText, FiClock, FiShield } from "react-icons/fi";
import { format } from "timeago.js";

const ActivityFeed = ({ orders = [], registrations = [], logs = [], loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <div className="h-6 w-40 bg-gray-100 rounded animate-pulse mb-4" />
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
      label: `Order placed`,
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
  ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 8);

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
      <h3 className="text-base font-semibold text-gray-700 mb-4">
        Recent Activity
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
            let bgColor = "bg-violet-50 text-violet-600";
            
            if (isOrder) {
              Icon = FiShoppingBag;
              bgColor = "bg-emerald-50 text-emerald-600";
            } else if (isLog) {
              Icon = FiShield;
              bgColor = "bg-blue-50 text-blue-600";
            }
            
            return (
              <li key={item.id || i} className="flex items-start gap-3">
                <div
                  className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${bgColor}`}
                >
                  <Icon size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {item.label}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{item.sub}</p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-1 text-gray-300 text-xs">
                  <FiClock size={11} />
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
