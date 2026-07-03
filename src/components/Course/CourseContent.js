import React, { useState, useEffect } from "react";
import { useGetCourseContentQuery, useGetCourseProgressQuery } from "../../redux/features/courses/coursesApi";
import Loader from "../Loader/Loader";
import Heading from "../Heading";
import CourseContentMedia from "./CourseContentMedia.js";
import Header from "../Header.js"

const CourseContent = ({id, user, pendingRecordingUrl, pendingRecordingTitle, onRecordingPlayed}) => {

  const { data: contentData, isLoading,refetch } = useGetCourseContentQuery(id,{refetchOnMountOrArgChange:true});
  const data = contentData?.content;
  const [activeVideo, setActiveVideo] = useState(() => {
    if (user && user._id) {
      const stored = localStorage.getItem(`courseProgress_${user._id}_${id}`) || localStorage.getItem(`lastWatched_${user._id}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.courseId === id && parsed.activeVideo !== undefined) {
            return parsed.activeVideo;
          }
        } catch (e) {}
      }
    }
    return 0;
  });

  const [isRestored, setIsRestored] = useState(false);

  const { data: progressData, isLoading: progressLoading } = useGetCourseProgressQuery(id, { refetchOnMountOrArgChange: true });

  useEffect(() => {
    if (data && user && user._id && !progressLoading) {
      if (!isRestored) {
        let foundIdx = -1;
        
        // 1. Prioritize Backend Progress
        if (progressData?.progress?.lastWatchedLesson) {
          foundIdx = data.findIndex(v => String(v._id) === String(progressData.progress.lastWatchedLesson));
        }

        // Recover from accidental index 0 overwrites:
        // If the backend says 0 (or -1), but they have completed other lessons, resume at the furthest lesson!
        if (foundIdx <= 0 && progressData?.progress?.completedLessons?.length > 0) {
            let maxCompletedIdx = -1;
            progressData.progress.completedLessons.forEach(lessonId => {
                const idx = data.findIndex(v => String(v._id) === String(lessonId));
                if (idx > maxCompletedIdx) maxCompletedIdx = idx;
            });
            if (maxCompletedIdx > 0) {
                foundIdx = maxCompletedIdx;
            }
        }

        // 2. Fetch Local Storage Fallback
        let localFoundIdx = -1;
        const stored = localStorage.getItem(`courseProgress_${user._id}_${id}`) || localStorage.getItem(`lastWatched_${user._id}`);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed.courseId === id) {
              if (parsed.videoId) {
                localFoundIdx = data.findIndex(v => String(v._id) === String(parsed.videoId));
              }
              if (localFoundIdx === -1 && parsed.activeVideo !== undefined && parsed.activeVideo < data.length) {
                localFoundIdx = parsed.activeVideo;
              }
            }
          } catch (e) {}
        }

        // 3. Resolve conflicts
        if (foundIdx <= 0 && localFoundIdx > 0) {
            // Recover from accidental index 0 overwrites by trusting local storage
            foundIdx = localFoundIdx;
        } else if (foundIdx === -1 && localFoundIdx !== -1) {
            // Normal fallback if backend is empty
            foundIdx = localFoundIdx;
        }

        if (foundIdx !== -1) {
          setActiveVideo(foundIdx);
        }
        setIsRestored(true);
      }
    } else if (!data && !isLoading && !progressLoading) {
       // if there's an error or no data, just restore anyway
       setIsRestored(true);
    }
  }, [id, data, user, isLoading, isRestored, progressData, progressLoading]);
const [open, setOpen]=useState(false);
const [route, setRoute]=useState('login')
  return (
    <>
      {isLoading || progressLoading || (data && !isRestored) ? (
        <Loader />
      ) : (
       <>
       <Header
       activeItem={1}
       open={open}
       setOpen={setOpen}
       route={route}
       setRoute={setRoute}
       />
       <div className="w-full grid 800px:grid-cols-10 mt-[80px] 800px:pr-8">
          <Heading title={data[activeVideo].title} description="" keywords="" />
          <div className="col-span-10">
            <CourseContentMedia
              data={data}
              id={id}
              activeVideo={activeVideo}
              setActiveVideo={setActiveVideo}
              user={user}
              refetch={refetch}
              pendingRecordingUrl={pendingRecordingUrl}
              pendingRecordingTitle={pendingRecordingTitle}
              onRecordingPlayed={onRecordingPlayed}
            />
          </div>
        </div>
       </>
      )}
    </>
  );
};

export default CourseContent;
