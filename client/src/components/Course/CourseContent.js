import React, { useState, useEffect } from "react";
import { useGetCourseContentQuery, useGetResumeProgressQuery } from "../../redux/features/courses/coursesApi";
import Loader from "../Loader/Loader";
import Heading from "../Heading";
import CourseContentMedia from "./CourseContentMedia.js";
import Header from "../Header.js"
import { FiChevronRight, FiBook, FiVideo } from "react-icons/fi";

const CourseContent = ({id, user, pendingRecordingUrl, pendingRecordingTitle, onRecordingPlayed, globalCourseName}) => {

  const { data: contentData, isLoading, refetch } = useGetCourseContentQuery(id,{refetchOnMountOrArgChange:true});
  const data = contentData?.content;
  
  // We initialize activeVideo to 0, but we block rendering until isRestored is true
  const [activeVideo, setActiveVideo] = useState(0);
  const [isRestored, setIsRestored] = useState(false);
  const [resumePlaybackTime, setResumePlaybackTime] = useState(0);
  
  // Hoisted from CourseContentMedia
  const [selectedRecordingUrl, setSelectedRecordingUrl] = useState(null);
  const [selectedRecordingTitle, setSelectedRecordingTitle] = useState(null);

  const { data: resumeData, isLoading: resumeLoading } = useGetResumeProgressQuery(id, { refetchOnMountOrArgChange: true });

  useEffect(() => {
    if (data && user && user._id && !resumeLoading) {
      if (!isRestored) {
        let targetIdx = 0;
        let pTime = 0;

        const resume = resumeData?.resume;

        if (resume && resume.lectureId) {
          // 1. Validate that the saved lecture still exists in the current curriculum
          const savedIdx = data.findIndex(v => String(v._id) === String(resume.lectureId));
          
          if (savedIdx !== -1) {
            targetIdx = savedIdx;
            pTime = resume.playbackTime || 0;

            // 2. Auto-skip logic: If previously completed (>= 95%), start the next available lecture
            if (resume.completionPercentage >= 95) {
              if (savedIdx + 1 < data.length) {
                targetIdx = savedIdx + 1;
                pTime = 0; // Reset playback time for the new lecture
              }
            }
          }
        }

        setActiveVideo(targetIdx);
        setResumePlaybackTime(pTime);
        setIsRestored(true);
      }
    } else if (!data && !isLoading && !resumeLoading) {
       // if there's an error or no data, just restore anyway
       setIsRestored(true);
    }
  }, [id, data, user, isLoading, isRestored, resumeData, resumeLoading]);

  const [open, setOpen]=useState(false);
  const [route, setRoute]=useState('login');

  return (
    <>
      {isLoading || resumeLoading || (data && !isRestored) ? (
        <Loader />
      ) : (
       <>
       <div className="bg-white border-b border-[#E5E7EB] sticky top-0 z-20 shrink-0">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-[19px] font-bold text-[#0F172A] tracking-tight leading-none whitespace-nowrap">
              {selectedRecordingTitle || data[activeVideo]?.title || "Course Viewer"}
            </h1>
            <div className="hidden sm:flex items-center gap-2 min-w-0 pl-3 border-l border-[#E2E8F0]">
              <span className="text-[13px] font-semibold text-[#334155] truncate max-w-[220px]" title={data[activeVideo]?.videoSection}>
                {selectedRecordingTitle ? "Live Session" : (data[activeVideo]?.videoSection || globalCourseName)}
              </span>
              <FiChevronRight size={13} className="text-[#CBD5E1] shrink-0" />
              <div className="flex items-center gap-1.5 text-[#64748B] text-[13px] whitespace-nowrap">
                {selectedRecordingTitle ? <FiVideo size={13} className="text-[#94A3B8]" /> : <FiBook size={13} className="text-[#94A3B8]" />}
                {selectedRecordingTitle ? "Recording" : (data[activeVideo]?.videoLength ? `${data[activeVideo].videoLength} mins` : "Lesson")}
              </div>
            </div>
          </div>
        </div>
      </div>
       <div className="w-full grid 800px:grid-cols-10 pt-4 800px:pr-8">
          <Heading title={selectedRecordingTitle || data[activeVideo]?.title} description="" keywords="" />
          <div className="col-span-10">
            <CourseContentMedia
              data={data}
              id={id}
              activeVideo={activeVideo}
              setActiveVideo={setActiveVideo}
              user={user}
              refetch={refetch}
              resumePlaybackTime={resumePlaybackTime}
              pendingRecordingUrl={pendingRecordingUrl}
              pendingRecordingTitle={pendingRecordingTitle}
              onRecordingPlayed={onRecordingPlayed}
              selectedRecordingUrl={selectedRecordingUrl}
              setSelectedRecordingUrl={setSelectedRecordingUrl}
              selectedRecordingTitle={selectedRecordingTitle}
              setSelectedRecordingTitle={setSelectedRecordingTitle}
            />
          </div>
        </div>
       </>
      )}
    </>
  );
};

export default CourseContent;
