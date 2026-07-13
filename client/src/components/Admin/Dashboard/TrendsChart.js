import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface/80 backdrop-blur-md border border-slate-600 rounded-xl shadow-glass p-4 text-sm z-50 relative">
        <p className="font-bold text-white mb-2 tracking-wide uppercase text-[10px] opacity-80">{label}</p>
        {payload.map((p) => (
          <p key={p.dataKey} className="flex items-center justify-between gap-4 font-medium mb-1">
            <span style={{ color: p.color }}>{p.name}</span>
            <span className="font-bold text-white text-base">{p.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const TrendsChart = ({ trends = [], loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <div className="h-6 w-40 bg-gray-100 rounded animate-pulse mb-4" />
        <div className="h-64 bg-gray-50 rounded-xl animate-pulse" />
      </div>
    );
  }

  // Format dates to short label
  const data = trends.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <div className="glass-panel p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white tracking-tight">
          User Overview
        </h3>
        <div className="flex gap-4 text-[11px] uppercase tracking-widest font-bold text-slate-400">
          <span className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(0,242,254,0.8)]" />
            Signups
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(254,9,121,0.8)]" />
            Purchases
          </span>
        </div>
      </div>
      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <filter id="glow1" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="glow2" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }}
              tickLine={false}
              axisLine={false}
              interval={Math.floor(data.length / 6)}
              dy={10}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
            <Line
              type="monotone"
              dataKey="signups"
              name="Signups"
              stroke="#00f2fe"
              strokeWidth={4}
              dot={false}
              activeDot={{ r: 6, fill: "#00f2fe", strokeWidth: 0, filter: "url(#glow1)" }}
              filter="url(#glow1)"
            />
            <Line
              type="monotone"
              dataKey="orders"
              name="Purchases"
              stroke="#fe0979"
              strokeWidth={4}
              dot={false}
              activeDot={{ r: 6, fill: "#fe0979", strokeWidth: 0, filter: "url(#glow2)" }}
              filter="url(#glow2)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendsChart;
