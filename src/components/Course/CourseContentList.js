import React from "react";
import { MdOutlineOndemandVideo } from "react-icons/md";
import { FaCheckCircle, FaFilePdf } from "react-icons/fa";

const CourseContentList = ({ data, setActiveVideo, activeVideo, isDemo, completedLessons = [], meetings = [] }) => {
  return (
    <div className={`mt-2 w-full ${!isDemo && "w-full"}`}>
      <div className="space-y-3">
        {data?.map((item, index) => {
          const isActive = index === activeVideo;
          const isDone = completedLessons.includes(item._id);

          return (
            <div
              key={item._id || index}
              onClick={() => !isDemo && setActiveVideo(index)}
              className={`border rounded-xl overflow-hidden shadow-sm transition-all duration-300 cursor-pointer group ${
                isActive ? "border-[#3B82F6] bg-[#EFF6FF] shadow-[0_0_15px_rgba(59,130,246,0.15)]" : "border-[#E5E7EB] bg-white hover:border-[#111827] hover:bg-[#F9FAFB]"
              }`}
            >
              <div className="p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 w-full">
                    <div
                      className={`mt-0.5 flex-shrink-0 p-1.5 rounded-lg border transition-all duration-300 ${
                        isDone
                          ? "bg-[#F0FDF4] text-[#10B981] border-[#bbf7d0]"
                          : isActive
                          ? "bg-[#DBEAFE] text-[#3B82F6] border-[#BFDBFE]"
                          : "bg-[#F3F4F6] text-[#9CA3AF] border-[#E5E7EB] group-hover:text-[#374151]"
                      }`}
                    >
                      {isDone ? <FaCheckCircle size={15} /> : <MdOutlineOndemandVideo size={17} />}
                    </div>
                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                      <h4
                        className={`text-sm font-bold leading-relaxed truncate transition-colors duration-300 ${
                          isDone
                            ? "text-[#10B981]"
                            : isActive
                            ? "text-[#3B82F6]"
                            : "text-[#374151] group-hover:text-[#111827]"
                        }`}
                        title={item.title}
                      >
                        {item.title}
                      </h4>
                      {item.videoLength && (
                        <span className="text-xs text-[#9CA3AF] font-medium">
                          {item.videoLength} mins
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CourseContentList;
