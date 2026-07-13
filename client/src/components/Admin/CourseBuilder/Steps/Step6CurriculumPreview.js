import React from "react";

const Step6CurriculumPreview = ({ courseData, setCourseData }) => {
  const handleContentChange = (index, field, value) => {
    const updatedContent = [...courseData.courseContentData];
    updatedContent[index][field] = value;
    setCourseData({ ...courseData, courseContentData: updatedContent });
  };
  
  const addSection = () => {
    setCourseData({ 
      ...courseData, 
      courseContentData: [...courseData.courseContentData, { videoUrl: "", title: "", description: "", videoSection: "New Section", videoLength: 0, resources: [], suggestion: "" }] 
    });
  };
  
  const removeContent = (index) => {
    const updatedContent = [...courseData.courseContentData];
    updatedContent.splice(index, 1);
    setCourseData({ ...courseData, courseContentData: updatedContent });
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-1">Curriculum Builder</h3>
        <p className="text-xs text-gray-500">Note: Only module names and duration will be shown to public users to protect paid content.</p>
      </div>
      
      <div className="space-y-4">
        {courseData.courseContentData.map((content, index) => (
          <div key={index} className="bg-white dark:bg-[#111111] border border-gray-100 dark:border-gray-800/60 rounded-none  overflow-hidden transition-all group hover:border-gray-300 dark:hover:border-gray-700">
            <div className="p-4 md:p-5 flex items-center justify-between bg-gray-50/50 dark:bg-[#0A0A0A] border-b border-gray-100 dark:border-gray-800/60">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white dark:bg-[#1A1A1A] border border-solid border-gray-200 shadow-none dark:border-gray-800 flex items-center justify-center text-xs font-semibold text-gray-500 shrink-0 ">{index + 1}</div>
                <input 
                  type="text" 
                  value={content.title || ""} 
                  onChange={(e) => handleContentChange(index, 'title', e.target.value)} 
                  className="bg-transparent border-none text-sm font-medium text-gray-900 dark:text-white outline-none w-48 md:w-64 placeholder-gray-400" 
                  placeholder="Untitled Lesson"
                />
              </div>
              <button onClick={() => removeContent(index)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-none transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
            
            <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[12px] font-medium text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">Section Name</label>
                <input type="text" value={content.videoSection} onChange={(e) => handleContentChange(index, 'videoSection', e.target.value)} className="w-full p-2.5 rounded-none border border-solid border-gray-200 shadow-none dark:border-gray-800 bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all" placeholder="e.g. Module 1: Introduction" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">Duration (Mins)</label>
                <input type="number" value={content.videoLength || ''} onChange={(e) => handleContentChange(index, 'videoLength', parseInt(e.target.value))} className="w-full p-2.5 rounded-none border border-solid border-gray-200 shadow-none dark:border-gray-800 bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all" placeholder="e.g. 15" />
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="block text-[12px] font-medium text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">Video URL (Private)</label>
                <input type="text" value={content.videoUrl} onChange={(e) => handleContentChange(index, 'videoUrl', e.target.value)} className="w-full p-2.5 rounded-none border border-solid border-gray-200 shadow-none dark:border-gray-800 bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all font-mono text-xs" placeholder="https://..." />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button onClick={addSection} className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-none text-[13px] font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#151515] transition-all flex items-center justify-center gap-2">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        Add Lesson
      </button>
    </div>
  );
};

export default Step6CurriculumPreview;
