import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useGetUserAllCoursesQuery } from "../../redux/features/courses/coursesApi.js";
import MyCourses from "../../components/Profile/MyCourses.jsx";

const StudentCoursesPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [courses, setCourses] = useState([]);
  const { data } = useGetUserAllCoursesQuery(undefined, {});

  useEffect(() => {
    if (data && user?.courses) {
      const filteredCourses = user.courses
        .map((userCourse) =>
          data.courses.find((course) => course._id === userCourse._id)
        )
        .filter((course) => course !== undefined);
      setCourses(filteredCourses);
    }
  }, [data, user?.courses]);

  return (
    <div className="animate-fade-in w-full">
      <MyCourses courses={courses} />
    </div>
  );
};

export default StudentCoursesPage;
