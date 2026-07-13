import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useGetUserAllCoursesQuery } from "../../redux/features/courses/coursesApi.js";
import StudentDashboard from "../../components/StudentDashboard.js";
import Protected from "../../utils/hooks/useProtected.js";
import Header from "../../components/Header.js";

const StudentDashboardPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [courses, setCourses] = useState([]);
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");
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
    <Protected>
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={5}
        setRoute={setRoute}
        route={route}
      />
      <StudentDashboard user={user} courses={courses} />
    </Protected>
  );
};

export default StudentDashboardPage;
