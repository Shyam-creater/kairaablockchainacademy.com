import React, { useState, useEffect } from "react";
import { useGetCourseContentQuery, useGetResumeProgressQuery, useGetCourseDetailsQuery } from "../../redux/features/courses/coursesApi";
import Loader from "../Loader/Loader";
import Heading from "../Heading";
import CourseContentMedia from "./CourseContentMedia.js";
import CourseSidebar from "./CourseSidebar.js";
import Header from "../Header.js"
import { FiChevronRight, FiBook, FiVideo } from "react-icons/fi";
import { useGetCourseProgressQuery, useGetStudentMeetingsQuery } from "../../redux/features/courses/coursesApi";

const CourseContent = ({id, user, pendingRecordingUrl, pendingRecordingTitle, onRecordingPlayed, globalCourseName}) => {

  // FETCH MEETINGS INSTEAD OF PRE-RECORDED CURRICULUM
  const { data: meetingsData, isLoading: meetingsLoading, refetch } = useGetStudentMeetingsQuery(id, { refetchOnMountOrArgChange: true });
  const { data: courseDetailsData } = useGetCourseDetailsQuery(id);
  const courseDetails = courseDetailsData?.course;
  
  // Transform meetings into the legacy `data` format expected by CourseContentMedia and CourseSidebar
  const data = React.useMemo(() => {
    if (!meetingsData?.meetings) return null;
    
    // Filter only meetings that have recordings or video materials, then map them to pseudo-curriculum items
    let list = [];
    meetingsData.meetings.forEach(m => {
      if (m.recordingUrl) {
        list.push({
          _id: m._id,
          title: m.topic || "Meeting Recording",
          videoUrl: m.recordingUrl,
          videoSection: "Live Sessions",
          videoLength: 0,
          links: m.materials || []
        });
      }
      if (m.materials) {
        m.materials.forEach((mat, idx) => {
          // If it's a video material, we might add it as a separate lesson? 
          // For simplicity, we just add the main recordingUrl as the main video.
          // The materials are already passed in links.
        });
      }
    });
    return list;
  }, [meetingsData]);
  
  const isLoading = meetingsLoading;
  
  // We initialize activeVideo to 0, but we block rendering until isRestored is true
  const [activeVideo, setActiveVideo] = useState(0);
  const [isRestored, setIsRestored] = useState(false);
  const [resumePlaybackTime, setResumePlaybackTime] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  // Hoisted from CourseContentMedia
  const [selectedRecordingUrl, setSelectedRecordingUrl] = useState(null);
  const [selectedRecordingTitle, setSelectedRecordingTitle] = useState(null);

  const { data: resumeData, isLoading: resumeLoading } = useGetResumeProgressQuery(id, { refetchOnMountOrArgChange: true });
  const { data: progressData } = useGetCourseProgressQuery(id, { refetchOnMountOrArgChange: true });
  const completedLessons = progressData?.completedLessons || [];

  useEffect(() => {
    if (data && user && user._id && !resumeLoading) {
      if (!isRestored) {
        let targetIdx = 0;
        let pTime = 0;
        
        // Prioritize local storage state to stay perfectly synced with the dashboard UI
        let localState = null;
        try {
          const localStr = localStorage.getItem(`courseProgress_${user._id}_${id}`);
          if (localStr) localState = JSON.parse(localStr);
        } catch(e) {}

        const resume = resumeData?.progress?.resumeData;

        // Use local state if it exists, otherwise fallback to backend state
        if (localState && localState.videoId) {
          const savedIdx = data.findIndex(v => String(v._id) === String(localState.videoId));
          if (savedIdx !== -1) {
            targetIdx = savedIdx;
            pTime = localState.currentTime || 0;
            
            if (localState.recordingUrl) {
              setSelectedRecordingUrl(localState.recordingUrl);
              setSelectedRecordingTitle(localState.videoTitle);
            }
          }
        } else if (resume && resume.lessonId) {
          // 1. Validate that the saved lecture still exists in the current curriculum
          const savedIdx = data.findIndex(v => String(v._id) === String(resume.lessonId));
          
          if (savedIdx !== -1) {
            targetIdx = savedIdx;
            pTime = resume.currentTime || 0;

            // 2. Auto-skip logic: If previously completed (>= 80%), start the next available lecture
            if (resume.watchPercentage >= 80) {
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
      {isLoading || resumeLoading || (!data) || (data && !isRestored) ? (
        <Loader />
      ) : (
       <>
       <div className="bg-white border-b border-[#E5E7EB] sticky top-0 z-20 shrink-0">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-[19px] font-bold text-[#0F172A] tracking-tight leading-none whitespace-nowrap">
              {selectedRecordingTitle || data?.[activeVideo]?.title || "Course Viewer"}
            </h1>
            <div className="hidden sm:flex items-center gap-2 min-w-0 pl-3 border-l border-[#E2E8F0]">
              <span className="text-[13px] font-semibold text-[#334155] truncate max-w-[220px]" title={data?.[activeVideo]?.videoSection}>
                {selectedRecordingTitle ? "Live Session" : (data?.[activeVideo]?.videoSection || globalCourseName)}
              </span>
              <FiChevronRight size={13} className="text-[#CBD5E1] shrink-0" />
              <div className="flex items-center gap-1.5 text-[#64748B] text-[13px] whitespace-nowrap">
                {selectedRecordingTitle ? <FiVideo size={13} className="text-[#94A3B8]" /> : <FiBook size={13} className="text-[#94A3B8]" />}
                {selectedRecordingTitle ? "Recording" : (data?.[activeVideo]?.videoLength ? `${data?.[activeVideo].videoLength} mins` : "Lesson")}
              </div>
            </div>
          </div>
        </div>
      </div>
       <div className={`w-full ${isFullScreen ? 'flex flex-col' : 'grid 800px:grid-cols-10'} pt-4 800px:pr-8 gap-6 max-w-[1400px] mx-auto px-6`}>
          <div className={`${isFullScreen ? 'w-full' : 'col-span-10 lg:col-span-7'}`}>
            <Heading title={selectedRecordingTitle || data?.[activeVideo]?.title} description="" keywords="" />
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
              completedLessons={completedLessons}
              isFullScreen={isFullScreen}
              setIsFullScreen={setIsFullScreen}
            />
          </div>
          {!isFullScreen && (
            <div className="col-span-10 lg:col-span-3">
              <CourseSidebar 
                data={data}
                activeVideo={activeVideo}
                setActiveVideo={setActiveVideo}
                completedLessons={completedLessons}
                setSelectedRecordingUrl={setSelectedRecordingUrl}
                setSelectedRecordingTitle={setSelectedRecordingTitle}
                courseDetails={courseDetails}
              />
            </div>
          )}
        </div>
       </>
      )}
    </>
  );
};

export default CourseContent;
