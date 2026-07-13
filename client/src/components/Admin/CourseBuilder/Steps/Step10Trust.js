import React from "react";

const Step10Trust = ({ courseData, setCourseData }) => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 border border-blue-100/50 dark:border-blue-800/30 p-6 md:p-8 rounded-3xl ">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Auto-Generated Trust Metrics</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 pl-11">These fields are automatically managed by the platform based on real user activity, providing social proof to incoming students.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 pl-0 md:pl-11">
          {[
            { label: "Average Rating", value: "0.0", suffix: "★", color: "text-amber-500" },
            { label: "Total Reviews", value: "0" },
            { label: "Total Enrolled", value: "0" },
            { label: "Completion Rate", value: "0%" },
            { label: "Certificates Issued", value: "0" },
            { label: "Last Updated", value: "Today", isText: true }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white/80 dark:bg-[#151515]/80 backdrop-blur-md p-5 rounded-none  border border-gray-100/50 dark:border-gray-800/50">
              <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold mb-1">{stat.label}</p>
              <p className={`text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight ${stat.isText ? 'text-xl' : ''}`}>
                {stat.value} {stat.suffix && <span className={`text-sm ml-1 ${stat.color}`}>{stat.suffix}</span>}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Step10Trust;
