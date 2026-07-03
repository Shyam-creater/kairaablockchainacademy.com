import React from "react";

const Step14Visibility = ({ courseData, setCourseData }) => {
  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setCourseData({ ...courseData, [e.target.name]: value });
  };

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-[#111111] p-6 rounded-none border border-gray-100 dark:border-blue-700/50/60  space-y-6">
        <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 uppercase tracking-wider mb-2">Enrollment Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">Start Date</label>
            <input type="date" name="enrollmentStart" value={courseData.enrollmentStart} onChange={handleChange} className="w-full p-3 rounded-none border border-solid border-blue-200 shadow-none dark:border-blue-700/50 bg-gray-50/50 dark:bg-[#0A0A0A] text-blue-900 dark:text-blue-100 text-sm outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">End Date</label>
            <input type="date" name="enrollmentEnd" value={courseData.enrollmentEnd} onChange={handleChange} className="w-full p-3 rounded-none border border-solid border-blue-200 shadow-none dark:border-blue-700/50 bg-gray-50/50 dark:bg-[#0A0A0A] text-blue-900 dark:text-blue-100 text-sm outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">Max Students (0 = Unlimited)</label>
            <input type="number" name="maximumStudents" value={courseData.maximumStudents} onChange={handleChange} className="w-full p-3 rounded-none border border-solid border-blue-200 shadow-none dark:border-blue-700/50 bg-gray-50/50 dark:bg-[#0A0A0A] text-blue-900 dark:text-blue-100 text-sm outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all" placeholder="e.g. 100" />
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-100 dark:border-blue-700/50/60">
          <label className="flex items-center space-x-3 cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input type="checkbox" name="waitlistEnabled" checked={courseData.waitlistEnabled} onChange={handleChange} className="peer sr-only" />
              <div className="w-10 h-5 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-black dark:peer-checked:bg-white"></div>
            </div>
            <span className="text-[13px] font-medium text-gray-700 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white transition-colors">Enable Waitlist (if maximum students reached)</span>
          </label>
        </div>
      </div>

      <div className="mt-8 p-8 bg-gradient-to-br from-blue-50/80 to-blue-50/50 dark:from-blue-900/10 dark:to-blue-900/10 border border-blue-200/50 dark:border-blue-800/30 rounded-3xl text-center  relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-500"></div>
        <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-2 tracking-tight">Ready to Publish?</h3>
        <p className="text-[13px] text-blue-700 dark:text-blue-300 max-w-md mx-auto">Review all the details. If everything is correct, click the <span className="font-semibold text-gray-800 dark:text-gray-200">Publish Course</span> button below to make it live.</p>
      </div>
    </div>
  );
};

export default Step14Visibility;
