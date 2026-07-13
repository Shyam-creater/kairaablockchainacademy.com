import React from "react";

const Step3CourseOverview = ({ courseData, setCourseData }) => {
  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setCourseData({ ...courseData, [e.target.name]: value });
  };

  const toggleBoolean = (name) => {
    setCourseData({ ...courseData, [name]: !courseData[name] });
  };

  return (
    <div className="space-y-8">
      {/* Group 1: Effort & Time */}
      <div className="bg-white dark:bg-[#111111] p-6 rounded-none border border-gray-100 dark:border-gray-800/60  space-y-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2">Time Commitment</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">Total Duration</label>
            <input type="text" name="duration" value={courseData.duration} onChange={handleChange} className="w-full p-3 rounded-none border border-solid border-gray-200 shadow-none dark:border-gray-800 bg-gray-50/50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all" placeholder="e.g. 8 Weeks, 42 Hours" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">Est. Total Study Hours</label>
            <input type="text" name="estimatedStudyHours" value={courseData.estimatedStudyHours} onChange={handleChange} className="w-full p-3 rounded-none border border-solid border-gray-200 shadow-none dark:border-gray-800 bg-gray-50/50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all" placeholder="e.g. 120 Hours" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">Weekly Effort</label>
            <input type="text" name="weeklyStudyHours" value={courseData.weeklyStudyHours} onChange={handleChange} className="w-full p-3 rounded-none border border-solid border-gray-200 shadow-none dark:border-gray-800 bg-gray-50/50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all" placeholder="e.g. 5-7 Hours/Week" />
          </div>
        </div>
      </div>

      {/* Group 2: Course Items */}
      <div className="bg-white dark:bg-[#111111] p-6 rounded-none border border-gray-100 dark:border-gray-800/60  space-y-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2">Included Materials</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">Projects</label>
            <input type="number" name="projectsCount" value={courseData.projectsCount} onChange={handleChange} className="w-full p-3 rounded-none border border-solid border-gray-200 shadow-none dark:border-gray-800 bg-gray-50/50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white text-sm text-center outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all" placeholder="0" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">Assignments</label>
            <input type="number" name="assignmentCount" value={courseData.assignmentCount} onChange={handleChange} className="w-full p-3 rounded-none border border-solid border-gray-200 shadow-none dark:border-gray-800 bg-gray-50/50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white text-sm text-center outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all" placeholder="0" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">Quizzes</label>
            <input type="number" name="quizCount" value={courseData.quizCount} onChange={handleChange} className="w-full p-3 rounded-none border border-solid border-gray-200 shadow-none dark:border-gray-800 bg-gray-50/50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white text-sm text-center outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all" placeholder="0" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">Downloads</label>
            <input type="number" name="downloadableResourcesCount" value={courseData.downloadableResourcesCount} onChange={handleChange} className="w-full p-3 rounded-none border border-solid border-gray-200 shadow-none dark:border-gray-800 bg-gray-50/50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white text-sm text-center outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all" placeholder="0" />
          </div>
        </div>
      </div>

      {/* Group 3: Accessibility */}
      <div className="bg-white dark:bg-[#111111] p-6 rounded-none border border-gray-100 dark:border-gray-800/60  space-y-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2">Accessibility Features</h3>
        
        <div className="flex flex-wrap gap-3">
          {[
            { key: "communityAccess", label: "Community Access" },
            { key: "mobileAccess", label: "Mobile Optimized" },
            { key: "desktopAccess", label: "Desktop Access" },
            { key: "offlineAccess", label: "Offline Viewing" },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => toggleBoolean(item.key)}
              className={`px-4 py-2.5 rounded-none text-xs font-semibold transition-all border flex items-center gap-2 ${
                courseData[item.key]
                  ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white "
                  : "bg-white dark:bg-[#151515] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${courseData[item.key] ? "bg-white dark:bg-black" : "bg-gray-300 dark:bg-gray-600"}`} />
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Step3CourseOverview;
