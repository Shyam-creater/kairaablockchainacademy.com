import React from 'react';
import XPWidget from '../ui/XPWidget';

const LxpRightSidebar = ({ courseDetails, progressData }) => {
  return (
    <div className="p-6">
      <XPWidget level={12} currentXP={2450} nextLevelXP={3000} totalHours={48} />
      
      <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-white font-bold mb-4">About this Course</h3>
        <p className="text-sm text-slate-400 leading-relaxed mb-6">
          {courseDetails?.description || "Master the core concepts and gain practical experience with real-world projects."}
        </p>
        
        <div className="space-y-4 pt-4 border-t border-white/10">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Total Lessons</span>
            <span className="text-white font-medium">{courseDetails?.courseData?.length || 0}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Level</span>
            <span className="text-white font-medium">{courseDetails?.level || 'Beginner'}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Certificate</span>
            <span className="text-primary font-medium">Yes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LxpRightSidebar;
