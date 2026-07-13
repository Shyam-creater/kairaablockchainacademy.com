import React from 'react';
import CourseContentList from '../Course/CourseContentList';

const LxpSidebar = ({ data, activeVideo, setActiveVideo, progressData, percentage }) => {
  return (
    <div className="p-5">
      <div className="mb-8">
        <h2 className="text-white font-bold text-lg mb-3">Course Progress</h2>
        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
           <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${percentage || 0}%` }}></div>
        </div>
        <p className="text-xs text-slate-400 mt-2 font-medium">{percentage || 0}% Completed</p>
      </div>
      <h3 className="text-slate-300 font-bold mb-4 uppercase tracking-wider text-xs">Modules</h3>
      <CourseContentList 
        data={data}
        activeVideo={activeVideo}
        setActiveVideo={setActiveVideo}
        completedLessons={progressData?.progress?.completedLessons || []}
      />
    </div>
  );
};

export default LxpSidebar;
