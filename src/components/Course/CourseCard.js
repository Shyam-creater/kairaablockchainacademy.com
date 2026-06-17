import React from "react";
import { Link } from "react-router-dom";

const CourseCard = ({ item, isProfile }) => {
  return (
    <Link
      to={!isProfile ? `/courses/${item._id}` : `course-access/${item._id}`}
      className="block h-full"
    >
      <div className="group flex flex-col justify-between p-3 bg-white border border-slate-100 hover:border-slate-200 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden h-full">
        
        {/* Image */}
        <div className="relative rounded-none overflow-hidden mb-3 h-44 bg-slate-50">
          <img
            src={item?.thumbnail?.url}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            alt="course-banner"
          />
        </div>

        {/* Title */}
        <h1 className="text-sm font-bold text-[#1C1678] mb-3 text-center leading-snug px-1 font-headingFont">
          {item.name}
        </h1>

        {/* Button */}
        <div className="pt-3 border-t border-slate-100 w-full">
  <button className="relative w-full overflow-hidden bg-transparent border-2 border-[#1C1678] text-[#1C1678] font-semibold py-2.5 rounded-full text-xs tracking-wider uppercase transition-colors duration-300 group-hover:text-white">
    <span className="absolute inset-0 w-0 bg-gradient-to-r from-orange-500 to-[#1C1678] transition-all duration-500 ease-out group-hover:w-full rounded-full"></span>
    <span className="relative z-10">Enroll Now</span>
  </button>
</div>

      </div>
    </Link>
  );
};

export default CourseCard;