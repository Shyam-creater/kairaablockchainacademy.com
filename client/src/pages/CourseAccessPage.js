import React, { useEffect,useState } from "react";
import { useLoadUserQuery } from "../redux/features/api/apiSlice";
import { Navigate, useParams } from "react-router-dom";
import Loader from "../components/Loader/Loader";
import CourseContent from "../components/Course/CourseContent.js";

const CourseAccessPage = () => {
    const [redirect, setRedirect] = useState(false);

  const { id } = useParams();

  const { isLoading, error, data } = useLoadUserQuery(undefined,{});
  // const data=JSON.stringify(userData.user)
  // console.log(`jhgvbj ${data}`)

  useEffect(() => {
    if (data?.user) {
      const isPurchased = data.user.courses.find((item) => item._id === id);
      if (!isPurchased || error) {
        setRedirect(true);
      }
    } else if (error || (!isLoading && !data)) {
      setRedirect(true);
    }
  }, [data, error, id, isLoading]);

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : data?.user ? (
        <div>
          <CourseContent id={id} user={data.user}/>
        </div>
      ) : null}
    </div>
  );
};

export default CourseAccessPage;
