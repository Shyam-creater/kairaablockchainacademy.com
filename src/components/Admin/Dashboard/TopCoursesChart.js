import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = ["#00f2fe", "#3b82f6", "#10b981", "#f59e0b", "#fe0979"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface/80 backdrop-blur-md border border-slate-600 rounded-xl shadow-glass p-3 text-sm z-50 relative">
        <p className="font-bold text-white mb-1 truncate max-w-[180px]">{label}</p>
        <p className="text-primary font-bold">{payload[0].value} purchases</p>
      </div>
    );
  }
  return null;
};

const TopCoursesChart = ({ topCourses = [], loading }) => {
  if (loading) {
    return (
      <div className="glass-panel p-6 h-full flex flex-col">
        <div className="h-6 w-40 bg-white/10 rounded animate-pulse mb-4" />
        <div className="flex-1 bg-white/5 rounded-xl animate-pulse min-h-[200px]" />
      </div>
    );
  }

  const data = topCourses.map((c) => ({
    name: c.name?.length > 22 ? c.name.slice(0, 22) + "…" : c.name,
    fullName: c.name,
    purchased: c.purchased || 0,
  }));

  if (!data.length) {
    return (
      <div className="glass-panel p-6 flex items-center justify-center h-full min-h-[250px]">
        <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">No course data yet</p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 h-full flex flex-col">
      <h3 className="text-lg font-bold text-white tracking-tight mb-4">
        Top Courses by Purchases
      </h3>
      <div className="flex-1 w-full min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={130}
            tick={{ fontSize: 11, fill: "#e2e8f0", fontWeight: 600 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
          <Bar dataKey="purchased" radius={[0, 6, 6, 0]} barSize={20}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} style={{ filter: `drop-shadow(0 0 4px ${COLORS[i % COLORS.length]}80)` }} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopCoursesChart;
