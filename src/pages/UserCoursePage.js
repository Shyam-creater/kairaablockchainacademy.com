import React, { useEffect, useState } from "react";
import { useGetUserAllCoursesQuery } from "../redux/features/courses/coursesApi";
import Header from "../components/Header";
import Heading from "../components/Heading";
import Footer from "../components/Footer";
import Loader from "../components/Loader/Loader";
import CourseCard from "../components/Course/CourseCard";

const UserCoursePage = () => {
  const { isLoading, data } = useGetUserAllCoursesQuery({});
  const [course, setCourse] = useState([]);
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (data) {
      setCourse(data.courses);
    }
  }, [data]);

  return (
    <div className="overflow-x-hidden min-h-screen font-sans text-slate-900 bg-[#F0F4FF]">
      <Heading
        title={"All courses - Kairaa Blockchain Academy"}
        description={"Kairaa Blockchain Academy is a programming community."}
        keywords={"programming community, coding skills, expert insights, collaboration, growth"}
      />
      {isLoading ? (
        <div className="flex-grow flex items-center justify-center min-h-[70vh]">
          <Loader />
        </div>
      ) : (
        <div className="flex-grow relative overflow-x-hidden pb-16">
          <Header
            route={route}
            setRoute={setRoute}
            open={open}
            setOpen={setOpen}
            activeItem={1}
          />

          <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 pt-20 pb-10 min-h-[70vh]">

            {/* Header */}
            <div className="text-center mb-10">
              <span className="text-orange-500 font-bold uppercase tracking-widest text-xs mb-3 block">
                Live Programs
              </span>
              <h2 className="text-2xl md:text-4xl font-extrabold font-headingFont text-[#1C1678] mb-3">
                Browse Our <span className="text-orange-500">Elite Live Courses</span>
              </h2>
              <p className="text-slate-500 text-base max-w-xl mx-auto font-paraFont">
                Join our premier instructor-led programs designed for deep interactive mastery and real-time expert guidance.
              </p>
            </div>

            {/* Grid — CourseCard directly, no extra wrapper */}
            {course && course.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {course.map((item, index) => (
                  <CourseCard item={item} key={index} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
                <p className="text-2xl font-extrabold text-[#1C1678] font-headingFont mb-2">
                  No Courses Available
                </p>
                <p className="text-slate-500 text-base font-paraFont">
                  Check back soon for new elite programs.
                </p>
              </div>
            )}

          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default UserCoursePage;