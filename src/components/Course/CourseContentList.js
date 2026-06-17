import React, { useState } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { MdOutlineOndemandVideo } from "react-icons/md";

const CourseContentList = ({ data, setActiveVideo, activeVideo, isDemo }) => {
  const [visibleSections, setVisibleSections] = useState(new Set([0]));

  // Unique section names in order
  const videoSections = [...new Set(data?.map((item) => item.videoSection))];

  let totalCount = 0;

  const toggleSection = (section) => {
    const next = new Set(visibleSections);
    next.has(section) ? next.delete(section) : next.add(section);
    setVisibleSections(next);
  };

  return (
    <div className={`mt-2 w-full ${!isDemo && "lg:ml-3 sticky top-28 left-0 z-30"}`}>
      <div className="space-y-3">
        {videoSections.map((section) => {
          const isSectionVisible = visibleSections.has(section);
          const sectionVideos = data.filter((item) => item.videoSection === section);
          const sectionVideoCount = sectionVideos.length;
          const sectionStartIndex = totalCount;
          totalCount += sectionVideoCount;

          return (
            <div
              key={section}
              className="bg-white border border-slate-100 hover:border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all duration-300"
            >
              {/* Section Header */}
              <div
                className="w-full flex justify-between items-center p-4 sm:p-5 cursor-pointer bg-slate-50/60 hover:bg-slate-50 transition-colors duration-200"
                onClick={() => toggleSection(section)}
              >
                <div className="flex flex-col gap-1 pr-4">
                  <h3 className="text-sm sm:text-base font-bold text-[#1C1678] leading-snug">
                    {section}
                  </h3>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    {sectionVideoCount} {sectionVideoCount > 1 ? "Lessons" : "Lesson"}
                  </span>
                </div>
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1C1678]/5 hover:bg-[#1C1678]/10 text-[#1C1678] flex items-center justify-center transition-colors duration-200">
                  {isSectionVisible ? (
                    <BsChevronUp size={13} />
                  ) : (
                    <BsChevronDown size={13} />
                  )}
                </div>
              </div>

              {/* Lessons */}
              {isSectionVisible && (
                <div className="divide-y divide-slate-100/60 border-t border-slate-100">
                  {sectionVideos.map((item, index) => {
                    const videoIndex = sectionStartIndex + index;
                    const isActive = videoIndex === activeVideo;

                    return (
                      <div
                        key={item._id || index}
                        onClick={() => !isDemo && setActiveVideo(videoIndex)}
                        className={`w-full cursor-pointer transition-all duration-200 p-4 pl-5 flex items-start justify-between gap-4 border-l-4 ${
                          isActive
                            ? "bg-[#1C1678]/5 border-l-[#1C1678]"
                            : "hover:bg-slate-50 border-l-transparent"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`mt-0.5 flex-shrink-0 p-1.5 rounded-lg ${
                              isActive
                                ? "bg-[#1C1678]/10 text-[#1C1678]"
                                : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            <MdOutlineOndemandVideo size={17} />
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <h4
                              className={`text-sm font-semibold leading-relaxed ${
                                isActive ? "text-[#1C1678]" : "text-slate-700"
                              }`}
                            >
                              {item.title}
                            </h4>
                            {item.videoLength && (
                              <span className="text-xs text-slate-400 font-medium">
                                {item.videoLength} mins
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CourseContentList;
