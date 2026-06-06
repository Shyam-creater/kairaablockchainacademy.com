import React, { useState } from "react";
import { useGetCourseDetailsQuery } from "../../redux/features/courses/coursesApi";
import Loader from "../Loader/Loader";
import Heading from "../Heading";

import CourseDetails from "./CourseDetails.js";
import { useLoadUserQuery } from "../../redux/features/api/apiSlice.js";



const CourseDetailsPage = ({ id }) => {

  const { data, isLoading } = useGetCourseDetailsQuery(id);

  // const [redirect, setRedirect] = useState(false);


  const { data: userData } = useLoadUserQuery(undefined, {});
  const [currentUser, setCurrentUser] = useState(userData?.user);




 

  


  
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Heading
            title={`${data.course.name} - Kairaa Blockchain Academy`}
            description=""
            keywords="Blockchain, Blockchain Certification"
          />
        
        
            <CourseDetails
              data={data.course}
              // setRedirect={setRedirect}
              currentUser={currentUser}
            />
          
        </div>
      )}
    </>
  );
};

export default CourseDetailsPage;
