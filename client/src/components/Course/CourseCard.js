import React from "react";
import { Link } from "react-router-dom";
import { FiClock, FiUser, FiPlayCircle, FiBarChart } from "react-icons/fi";
import { NeonBadge, GlassPanel } from "../ui/NeonUI";

const CourseCard = ({ item, isProfile }) => {
  // Mock data for student progress view
  const progress = isProfile ? Math.floor(Math.random() * 100) : 0;
  const duration = item?.duration || "12 Weeks";
  const instructor = item?.instructor || "Expert Staff";
  const level = item?.level || "Beginner";

  return (
    <Link
      to={!isProfile ? `/courses/${item._id}` : `course-access/${item._id}`}
      className="block h-full outline-none"
    >
      <GlassPanel glow="hover:border-primary/50" className="group flex flex-col justify-between p-4 bg-[#0B0F19]/80 border border-white/10 rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(0,242,254,0.15)] overflow-hidden h-full cursor-pointer">
        
        {/* Image & Badge */}
        <div className="relative rounded-xl overflow-hidden mb-5 h-48 bg-surface border border-white/5">
          <img
            src={item?.thumbnail?.url || "https://images.unsplash.com/photo-1639762681485-074b7f4ec651?w=800&q=80"}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
            alt="course-banner"
          />
          <div className="absolute top-3 left-3">
            <NeonBadge color="primary">{level}</NeonBadge>
          </div>
          {isProfile && progress > 0 && (
             <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 flex items-center gap-1">
                <FiBarChart className="text-primary" size={12} />
                <span className="text-[10px] font-bold text-white">{progress}%</span>
             </div>
          )}
          {/* Overlay play button on hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="w-14 h-14 bg-primary/20 backdrop-blur-md rounded-full flex items-center justify-center border border-primary/50 shadow-[0_0_20px_rgba(0,242,254,0.4)]">
              <FiPlayCircle className="text-white ml-1" size={28} />
            </div>
          </div>
        </div>

        {/* Title & Metadata */}
        <div className="flex-1 flex flex-col">
          <h1 className="text-lg font-bold text-white mb-3 leading-snug group-hover:text-primary transition-colors duration-300">
            {item.name || "Premium Blockchain Course"}
          </h1>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 mb-4 mt-auto">
            <div className="flex items-center gap-1.5">
              <FiClock className="text-accent" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FiUser className="text-[#00e676]" />
              <span>{instructor}</span>
            </div>
          </div>

          {/* Progress Bar or Action Button */}
          {isProfile ? (
            <div className="pt-4 border-t border-white/10 w-full">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-2">
                <span className={progress === 100 ? "text-[#00e676]" : "text-slate-400"}>
                  {progress === 100 ? "Completed" : "In Progress"}
                </span>
                <span className="text-white">{progress}%</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${progress === 100 ? "bg-[#00e676] shadow-[0_0_10px_rgba(0,230,118,0.5)]" : "bg-gradient-to-r from-primary to-accent shadow-[0_0_10px_rgba(0,242,254,0.5)]"}`} 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <div className="pt-4 border-t border-white/10 w-full">
              <button className="w-full bg-transparent border border-primary/50 text-primary font-bold py-2.5 rounded-xl text-xs tracking-wider uppercase transition-all duration-300 group-hover:bg-primary group-hover:text-slate-900 group-hover:shadow-[0_0_20px_rgba(0,242,254,0.4)]">
                Enroll Now
              </button>
            </div>
          )}
        </div>

      </GlassPanel>
    </Link>
  );
};

export default CourseCard;
