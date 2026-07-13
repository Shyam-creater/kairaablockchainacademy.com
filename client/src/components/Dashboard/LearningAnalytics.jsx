import React from "react";
import { GlassPanel } from "../ui/NeonUI";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// Mock data removed in favor of real chartData prop
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0B0F19]/90 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.5)]">
        <p className="text-white font-bold text-sm mb-1">{label}</p>
        <p className="text-primary text-xs font-semibold">{`Hours: ${payload[0].value}h`}</p>
        {payload[1] && <p className="text-accent text-xs font-semibold">{`XP Earned: ${payload[1].value}`}</p>}
      </div>
    );
  }
  return null;
};

const LearningAnalytics = ({ chartData = [] }) => {
  return (
    <GlassPanel className="p-6">
      <div className="flex justify-between items-center mb-6">
         <h3 className="text-lg font-bold text-white flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(0,242,254,0.8)]"></span>
           Learning Velocity
         </h3>
         <select className="bg-white/5 border border-white/10 text-xs text-slate-300 rounded-lg px-2 py-1 outline-none focus:border-primary">
            <option>This Week</option>
            <option>Last Week</option>
            <option>This Month</option>
         </select>
      </div>
      
      <div className="w-full h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00F2FE" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00F2FE" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="hours" stroke="#00F2FE" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassPanel>
  );
};

export default LearningAnalytics;
