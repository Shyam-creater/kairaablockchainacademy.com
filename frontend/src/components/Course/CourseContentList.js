import React, { useState } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { MdOutlineOndemandVideo } from "react-icons/md";

const CourseContentList = ({ data, setActiveVideo, activeVideo ,isDemo}) => {
  const [visibleSections, setVisibleSections] = useState(new Set());

  // find unique video sections
  const videoSections = [...new Set(data?.map((item) => item.videoSection))];

  // total count of videos from previous sections
  let totalCount = 0;

  const toggleSection = (section) => {
    const newVisibleSections = new Set(visibleSections);
    if (newVisibleSections.has(section)) {
      newVisibleSections.delete(section);
    } else {
      newVisibleSections.add(section);
    }

    setVisibleSections(newVisibleSections);
  };
  return (
    <div
      className={`mt-[15px] w-full ${
        !isDemo && "ml-[10px]  sticky top-24 left-0 z-30"
      }`}
    >
      {videoSections.map((section, sectionIndex) => {
        const isSectionVisible = visibleSections.has(section);
        // Filter videos by section
        const sectionVideos = data.filter(
          (item) => item.videoSection === section
        );

        const sectionVideoCount = sectionVideos.length; // Number of videos in the current section
        // const sectionVideoLength = sectionVideos.reduce(
        //   (totalLength, item) => totalLength + item.videoLength,
        //   0
        // );
        const sectionStartIndex = totalCount; // Start index of videos within the current section
        totalCount += sectionVideoCount; // Update the total count of videos

        // const sectionContentHours = sectionVideoLength / 60;

        return (
          <div
            className={`${
             
              "border-b border-[#0000001c]  pb-2"
            }`}
            key={section}
          >
            <div className="w-full flex">
              {/* Render video section */}
              <div className="w-full flex justify-between items-center">
                <h2 className="text-[22px] text-black  ">
                  {section}
                </h2>
                <button
                  className="mr-4 cursor-pointer text-black "
                  onClick={() => toggleSection(section)}
                >
                  {isSectionVisible ? (
                    <BsChevronUp size={20} />
                  ) : (
                    <BsChevronDown size={20} />
                  )}
                </button>
              </div>
            </div>
            <h5 className="text-black ">
              {sectionVideoCount} {sectionVideoCount>1 ? "Lessons" : "Lesson"}{" "}
              {/* {sectionVideoLength < 60
            ? sectionVideoLength
            : sectionContentHours.toFixed(2)}{" "}
          {sectionVideoLength > 60 ? "hours" : "minutes"} */}
            </h5>
            <br />
            {isSectionVisible && (
              <div className="w-full">
                {sectionVideos.map((item, index) => {
                  const videoIndex = sectionStartIndex + index; // Calculate the video index within the overall list
                  // const contentLength = item.videoLength / 60;
                  return (
                    <div
                      className={`w-full ${
                        videoIndex === activeVideo ? " bg-slate-300" : ""
                      } cursor-pointer transition-all p-2`}
                      key={item._id}
                      onClick={() =>
                        isDemo ? null : setActiveVideo(videoIndex)
                      }
                    >
                      <div className="flex items-start py-2">
                        <div>
                          <MdOutlineOndemandVideo
                            size={25}
                            className="mr-2"
                            color="#1cdada"
                          />
                        </div>
                        <h1 className="text-[18px] inline-block break-words text-black  ">
                          {item.title}
                        </h1>
                      </div>
                      {/* <h5 className="pl-8 text-black ">
                    {item.videoLength > 60 ? contentLength.toFixed(2) : item.videoLength}{" "}
                    {item.videoLength > 60 ? "hours" : "minutes"}
                  </h5> */}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CourseContentList;
