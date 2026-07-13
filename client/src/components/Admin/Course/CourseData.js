
import React from "react";
import { styles } from "../../../styles/style";
import { SlPlus } from "react-icons/sl";
import { toast } from "react-hot-toast";

const CourseData = ({
  benefits,
  setBenefits,
  prerequisites,
  setPrerequisites,
  active,
  setActive,
}) => {
  const handleBenefitsChange = (index, value) => {
    const updatedBenefits = benefits.map((benefit, i) =>
      i === index ? { ...benefit, title: value } : benefit
    );
    setBenefits(updatedBenefits);
  };

  const handleAddBenefits = () => {
    setBenefits([...benefits, { title: "" }]);
  };

  const handlePrerequisitesChange = (index, value) => {
    const updatedPrerequisites = prerequisites.map((prerequisite, i) =>
      i === index ? { ...prerequisite, title: value } : prerequisite
    );
    setPrerequisites(updatedPrerequisites);
  };

  const handleAddPrerequisites = () => {
    setPrerequisites([...prerequisites, { title: "" }]);
  };

  const prevButton = () => {
    setActive(active - 1);
  };

  const handleOptions = () => {
    if (
      benefits[benefits.length - 1]?.title !== "" &&
      prerequisites[prerequisites.length - 1]?.title !== ""
    ) {
      setActive(active + 1);
    } else {
      toast.error("Please fill in the fields to proceed to the next step");
    }
  };

  return (
    <div className="w-full glass-panel p-6 800px:p-10 flex flex-col gap-8">
      {/* Benefits Card */}
      <div className="bg-white/5 border border-slate-600 rounded-xl p-6 shadow-inner">
        <label className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2 block" htmlFor="">
          Benefits for Students
        </label>
        <p className="text-xs text-slate-500 mb-6">List the key skills or knowledge students will gain from completing this course.</p>
        
        <div className="flex flex-col gap-3">
          {benefits.map((benefit, index) => (
            <input
              type="text"
              key={index}
              name="benefit"
              placeholder={`e.g. Master React fundamentals (Benefit ${index + 1})`}
              required
              className="w-full h-[45px] bg-black/20 border border-slate-600 rounded-lg px-4 text-white text-sm outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all placeholder:text-slate-600"
              value={benefit.title}
              onChange={(e) => handleBenefitsChange(index, e.target.value)}
            />
          ))}
        </div>
        
        <div 
          className="mt-6 btn-action"
          onClick={handleAddBenefits}
        >
          <SlPlus size={16} /> Add Another Benefit
        </div>
      </div>

      {/* Prerequisites Card */}
      <div className="bg-white/5 border border-slate-600 rounded-xl p-6 shadow-inner">
        <label className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2 block" htmlFor="">
          Course Prerequisites
        </label>
        <p className="text-xs text-slate-500 mb-6">List any prior knowledge or tools students need before taking this course.</p>
        
        <div className="flex flex-col gap-3">
          {prerequisites.map((prerequisite, index) => (
            <input
              type="text"
              key={index}
              name="prerequisite"
              placeholder={`e.g. Basic understanding of HTML/CSS (Prerequisite ${index + 1})`}
              required
              className="w-full h-[45px] bg-black/20 border border-slate-600 rounded-lg px-4 text-white text-sm outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all placeholder:text-slate-600"
              value={prerequisite.title}
              onChange={(e) => handlePrerequisitesChange(index, e.target.value)}
            />
          ))}
        </div>
        
        <div 
          className="mt-6 btn-action"
          onClick={handleAddPrerequisites}
        >
          <SlPlus size={16} /> Add Another Prerequisite
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 mt-4">
        <div
          className="w-full md:w-[200px] h-[50px] btn-secondary"
          onClick={() => prevButton()}>
          Previous Step
        </div>
        <div
          className="w-full md:w-[200px] h-[50px] btn-primary"
          onClick={() => handleOptions()}>
          Next Step
        </div>
      </div>
    </div>
  );
};

export default CourseData;
