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

const COLORS = ["#7c3aed", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-sm">
        <p className="font-semibold text-gray-700 truncate max-w-[180px]">{label}</p>
        <p className="text-violet-600 font-bold">{payload[0].value} purchases</p>
      </div>
    );
  }
  return null;
};

const TopCoursesChart = ({ topCourses = [], loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <div className="h-6 w-40 bg-gray-100 rounded animate-pulse mb-4" />
        <div className="h-52 bg-gray-50 rounded-xl animate-pulse" />
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
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex items-center justify-center h-52">
        <p className="text-gray-400 text-sm">No course data yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
      <h3 className="text-base font-semibold text-gray-700 mb-4">
        Top Courses by Purchases
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={130}
            tick={{ fontSize: 11, fill: "#374151" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="purchased" radius={[0, 6, 6, 0]} barSize={20}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopCoursesChart;
