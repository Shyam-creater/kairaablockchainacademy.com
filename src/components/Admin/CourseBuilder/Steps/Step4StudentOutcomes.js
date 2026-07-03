import React from "react";

const Step4StudentOutcomes = ({ courseData, setCourseData }) => {
  const handleBenefitChange = (index, value) => {
    const updatedOutcomes = [...courseData.learningOutcomes];
    updatedOutcomes[index].title = value;
    setCourseData({ ...courseData, learningOutcomes: updatedOutcomes });
  };
  const addBenefit = () => setCourseData({ ...courseData, learningOutcomes: [...courseData.learningOutcomes, { title: "" }] });
  const removeBenefit = (index) => {
    const updatedOutcomes = [...courseData.learningOutcomes];
    updatedOutcomes.splice(index, 1);
    setCourseData({ ...courseData, learningOutcomes: updatedOutcomes });
  };

  const handlePrereqChange = (index, value) => {
    const updatedPrereqs = [...courseData.prerequisites];
    updatedPrereqs[index].title = value;
    setCourseData({ ...courseData, prerequisites: updatedPrereqs });
  };
  const addPrereq = () => setCourseData({ ...courseData, prerequisites: [...courseData.prerequisites, { title: "" }] });
  const removePrereq = (index) => {
    const updatedPrereqs = [...courseData.prerequisites];
    updatedPrereqs.splice(index, 1);
    setCourseData({ ...courseData, prerequisites: updatedPrereqs });
  };

  const handleCareerChange = (index, field, value) => {
    const updatedCareers = [...courseData.careerPaths];
    updatedCareers[index][field] = value;
    setCourseData({ ...courseData, careerPaths: updatedCareers });
  };
  const addCareer = () => setCourseData({ ...courseData, careerPaths: [...courseData.careerPaths, { title: "", expectedSalary: "" }] });
  const removeCareer = (index) => {
    const updatedCareers = [...courseData.careerPaths];
    updatedCareers.splice(index, 1);
    setCourseData({ ...courseData, careerPaths: updatedCareers });
  };

  return (
    <div className="space-y-8">
      {/* What You Will Learn */}
      <div className="bg-white dark:bg-[#111111] p-6 rounded-none border border-gray-100 dark:border-gray-800/60  space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-1">Learning Outcomes</h3>
          <p className="text-xs text-gray-500 mb-4">What will students be able to do after finishing this course?</p>
        </div>
        <div className="space-y-3">
          {courseData.learningOutcomes.map((outcome, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-[#1A1A1A] flex items-center justify-center text-xs text-gray-400 shrink-0">{index + 1}</div>
              <input type="text" value={outcome.title} onChange={(e) => handleBenefitChange(index, e.target.value)} className="flex-1 p-3 rounded-none border border-solid border-gray-200 shadow-none dark:border-gray-800 bg-gray-50/50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all" placeholder="e.g. Build production-ready fullstack applications" />
              <button onClick={() => removeBenefit(index)} className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-none transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          ))}
        </div>
        <button onClick={addBenefit} className="mt-2 text-[13px] font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white flex items-center gap-1 transition-colors">
          <span>+</span> Add Outcome
        </button>
      </div>

      {/* Prerequisites */}
      <div className="bg-white dark:bg-[#111111] p-6 rounded-none border border-gray-100 dark:border-gray-800/60  space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-1">Prerequisites</h3>
          <p className="text-xs text-gray-500 mb-4">What should students know before starting?</p>
        </div>
        <div className="space-y-3">
          {courseData.prerequisites.map((prereq, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700 shrink-0 mx-2" />
              <input type="text" value={prereq.title} onChange={(e) => handlePrereqChange(index, e.target.value)} className="flex-1 p-3 rounded-none border border-solid border-gray-200 shadow-none dark:border-gray-800 bg-gray-50/50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all" placeholder="e.g. Basic understanding of HTML and CSS" />
              <button onClick={() => removePrereq(index)} className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-none transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          ))}
        </div>
        <button onClick={addPrereq} className="mt-2 text-[13px] font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white flex items-center gap-1 transition-colors">
          <span>+</span> Add Prerequisite
        </button>
      </div>

      {/* Career Opportunities */}
      <div className="bg-white dark:bg-[#111111] p-6 rounded-none border border-gray-100 dark:border-gray-800/60  space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-1">Career Paths</h3>
          <p className="text-xs text-gray-500 mb-4">What jobs can students get after this course?</p>
        </div>
        <div className="space-y-3">
          {courseData.careerPaths.map((career, index) => (
            <div key={index} className="flex items-center gap-3">
              <input type="text" value={career.title} onChange={(e) => handleCareerChange(index, 'title', e.target.value)} className="flex-1 p-3 rounded-none border border-solid border-gray-200 shadow-none dark:border-gray-800 bg-gray-50/50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all" placeholder="e.g. Senior Frontend Developer" />
              <input type="text" value={career.expectedSalary} onChange={(e) => handleCareerChange(index, 'expectedSalary', e.target.value)} className="w-[140px] md:w-[180px] p-3 rounded-none border border-solid border-gray-200 shadow-none dark:border-gray-800 bg-gray-50/50 dark:bg-[#0A0A0A] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-gray-400 dark:focus:border-gray-600 transition-all" placeholder="e.g. $120k / year" />
              <button onClick={() => removeCareer(index)} className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-none transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          ))}
        </div>
        <button onClick={addCareer} className="mt-2 text-[13px] font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white flex items-center gap-1 transition-colors">
          <span>+</span> Add Career Path
        </button>
      </div>
    </div>
  );
};

export default Step4StudentOutcomes;
