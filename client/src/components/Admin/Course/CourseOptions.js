import React from "react";
import { IoMdCheckmark } from "react-icons/io";

const CourseOptions = ({ active, setActive }) => {
  const options = [
    "Course Information",
    "Course Options",
    "Course Content",
    "Course Preview",
  ];

  return (
    <div className="w-full flex items-center justify-between glass-panel p-6 rounded-2xl mb-4 relative z-10">
      {options.map((option, index) => (
        <div key={index} className="flex flex-col items-center relative flex-1">
          {/* Connector Line (except for the last item) */}
          {index !== options.length - 1 && (
            <div
              className={`hidden 800px:block absolute top-[17px] left-[50%] w-full h-[3px] z-0 transition-all duration-300 ${
                active > index ? "bg-primary shadow-[0_0_10px_rgba(0,242,254,0.5)]" : "bg-white/10"
              }`}
            />
          )}

          {/* Step Icon */}
          <div
            className={`w-[35px] h-[35px] rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
              active + 1 > index ? "bg-primary shadow-[0_0_15px_rgba(0,242,254,0.8)] text-slate-900 scale-110" : "bg-black/20 border-2 border-white/10 text-slate-500"
            }`}
          >
            <IoMdCheckmark className="text-[20px]" />
          </div>

          {/* Step Text */}
          <h5
            className={`mt-4 text-center transition-all duration-300 ${
              active === index
                ? "text-white font-bold tracking-wide drop-shadow-md"
                : "text-slate-400 font-medium tracking-wide"
            } text-[12px] 800px:text-[14px] uppercase`}
          >
            {option}
          </h5>
        </div>
      ))}
    </div>
  );
};

export default CourseOptions;
