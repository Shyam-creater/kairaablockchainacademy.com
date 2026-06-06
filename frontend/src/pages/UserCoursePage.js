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
    <div>
      <Heading
        title={"All courses - Kairaa Blockchain Academy"}
        description={"Kairaa Blockchain Academy is a programming community."}
        keywords={
          "programming community, coding skills, expert insights, collaboration, growth"
        }
      />
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Header
            route={route}
            setRoute={setRoute}
            open={open}
            setOpen={setOpen}
            activeItem={1}
          />

          <div className="w-[95%] 800px:w-[85%] min-h-[70vh] m-auto">
           
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-3 md:gap-[45px] lg:grid-cols-3 lg:gap-[45px] 1500px:grid-cols-4 1500px:gap-[35px]  border-0 my-36">
              {course &&
                course.map((item, index) => (
                  <CourseCard item={item} key={index} />
                ))}
            </div>
          </div>
        </>
      )}
      <Footer />
    </div>
  );
};

export default UserCoursePage;
