import React, { useState,useEffect, act } from "react";
import SideBarProfile from "../components/SideBarProfile.js";
import { useLogOutQuery } from "../redux/features/auth/authApi.js";
import ChangePassword from "../components/ChangePassword.js"
import ProfileInfo from "../components/ProfileInfo.js"
import { useGetUserAllCoursesQuery } from '../redux/features/courses/coursesApi.js'
import CourseCard from "./Course/CourseCard.js";


const Profile = ({ user }) => {
  
  const [avatar, setAvatar] = useState(null);
  // const [activeItem, setActiveItem]=useState(5);
  const [active, setActive] = useState(1);
  const [logOut, setLogOut] = useState(false);
  const [courses, setCourses] = useState([]);
const {data}=useGetUserAllCoursesQuery(undefined, {})




  const { refetch } = useLogOutQuery(undefined, {
    skip: !logOut,
  });
  const logOutHandler = () => {
    setLogOut(true);
  };

  useEffect(() => {
    if (logOut) {
      refetch().then(() => {
     
      }).catch((error) => {
        console.error("Error logging out:", error);
      }).finally(() => {
        setLogOut(false);
      });
    }
  }, [logOut, refetch]);
  useEffect(() => {
    if (data) {
      const filteredCourses = user.courses
        .map((userCourse) =>
          data.courses.find((course) => course._id === userCourse._id)
        )
        .filter((course) => course !== undefined);
      setCourses(filteredCourses);
    
    }
  }, [data]);


  return (
    <div className="w-full flex  mt-[80px]">
      <div
        className={`w-[60px] 800px:w-[310px] h-screen bg-white  bg-opacity-90 border  border-slate-700  shadow-sm
         
       `}
      >
        <SideBarProfile
          user={user}
          active={active}
          avatar={avatar}
          setActive={setActive}
          logOutHandler={logOutHandler}
          // className="fixed"
        />
        
      </div>
      {
          active === 1 && (
          <div className="w-full h-full bg-transparent mt-[40px]">
              <ProfileInfo user={user} avatar={avatar}/>
          </div>
          )
        }
        {
          active ===2 && (
            <div className="w-full h-full bg-transparent mt-[10px]">
           <ChangePassword user={user}/>
        </div>
          )
        }


{active === 3 && (
        <div className="w-full pl-7 px-2 800px:px-10 800px:pl-8 mt-[80px]">
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px] mb-12 border-0">
            {courses &&
              courses.map((item, index) => (
                <CourseCard item={item} key={index} isProfile={true} />
              ))}
          </div>
          {courses.length === 0 && (
            <h1 className="text-center text-[18px] font-Poppins dark:text-white text-black">
              You don&apos;t have any purchased courses!
            </h1>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
