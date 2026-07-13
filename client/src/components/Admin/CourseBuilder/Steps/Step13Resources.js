import React from "react";

const Step13Resources = ({ courseData, setCourseData }) => {
  const handleChange = (e) => setCourseData({ ...courseData, [e.target.name]: e.target.value });

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-[#111111] p-6 rounded-none border border-gray-100 dark:border-gray-800/60  space-y-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2">Downloadable Materials</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">Syllabus PDF URL</label>
            <input type="text" name="syllabusUrl" value={courseData.syllabusUrl} onChange={handleChange} className="w-full p-3 rounded-none border border-solid border-gray-200 shadow-none dark:border-gray-800 bg-gray-50/50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all font-mono text-xs" placeholder="https://" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">Brochure PDF URL</label>
            <input type="text" name="brochure" value={courseData.brochure} onChange={handleChange} className="w-full p-3 rounded-none border border-solid border-gray-200 shadow-none dark:border-gray-800 bg-gray-50/50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all font-mono text-xs" placeholder="https://" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">Roadmap PDF URL</label>
            <input type="text" name="roadmapPdf" value={courseData.roadmapPdf} onChange={handleChange} className="w-full p-3 rounded-none border border-solid border-gray-200 shadow-none dark:border-gray-800 bg-gray-50/50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all font-mono text-xs" placeholder="https://" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">Sample Notes URL</label>
            <input type="text" name="sampleNotes" value={courseData.sampleNotes} onChange={handleChange} className="w-full p-3 rounded-none border border-solid border-gray-200 shadow-none dark:border-gray-800 bg-gray-50/50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all font-mono text-xs" placeholder="https://" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step13Resources;
