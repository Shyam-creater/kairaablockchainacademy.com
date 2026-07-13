import React from 'react';
import CourseContentMedia from '../Course/CourseContentMedia';

const LxpMainArea = ({ data, id, activeVideo, setActiveVideo, user, refetch, courseDetails, markLessonWatched, completedLessons }) => {
  const handleMarkWatched = async () => {
    try {
       await markLessonWatched({ courseId: id, lessonId: data[activeVideo]._id });
       refetch();
    } catch(err) {}
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <CourseContentMedia 
         data={data}
         id={id}
         activeVideo={activeVideo}
         setActiveVideo={setActiveVideo}
         user={user}
         refetch={refetch}
         onMarkWatched={handleMarkWatched}
         completedLessons={completedLessons}
         courseDetails={courseDetails}
         isCurrentLessonCompleted={data?.[activeVideo]?._id ? completedLessons.includes(data[activeVideo]._id) : false}
      />
    </div>
  );
};

export default LxpMainArea;
