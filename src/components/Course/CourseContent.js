import React, { useState } from "react";
import { useGetCourseContentQuery } from "../../redux/features/courses/coursesApi";
import Loader from "../Loader/Loader";
import Heading from "../Heading";
import CourseContentMedia from "./CourseContentMedia.js";
import Header from "../Header.js"
import CourseContentList from "./CourseContentList.js"

const CourseContent = ({id,user}) => {

  const { data: contentData, isLoading,refetch } = useGetCourseContentQuery(id,{refetchOnMountOrArgChange:true});
  const data = contentData?.content;
  const [activeVideo, setActiveVideo] = useState(0);
const [open, setOpen]=useState(false);
const [route, setRoute]=useState('login')
  return (
    <>
      {isLoading ? (
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
          <div className="col-span-7">
            <CourseContentMedia
              data={data}
              id={id}
              activeVideo={activeVideo}
              setActiveVideo={setActiveVideo}
              user={user}
              refetch={refetch}
            />
          </div>
          <div className="hidden 800px:block 800px:col-span-3">
            <CourseContentList
              setActiveVideo={setActiveVideo}
              data={data}
              activeVideo={activeVideo}
            />
          </div>
        </div>
       </>
      )}
    </>
  );
};

export default CourseContent;
