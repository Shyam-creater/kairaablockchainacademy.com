import React, { useState, useEffect } from "react";
import SideBarProfile from "../components/SideBarProfile.js";
import { useLogOutQuery } from "../redux/features/auth/authApi.js";
import ChangePassword from "../components/ChangePassword.js";
import ProfileInfo from "../components/ProfileInfo.js";
import { useGetUserAllCoursesQuery } from '../redux/features/courses/coursesApi.js';
import CourseCard from "./Course/CourseCard.js";

const Profile = ({ user }) => {
  const [avatar, setAvatar] = useState(null);
  const [active, setActive] = useState(1);
  const [logOut, setLogOut] = useState(false);
  const [courses, setCourses] = useState([]);
  
  const { data } = useGetUserAllCoursesQuery(undefined, {});
  const { refetch } = useLogOutQuery(undefined, { skip: !logOut });

  const logOutHandler = () => {
    setLogOut(true);
  };

  useEffect(() => {
    if (logOut) {
      refetch().then(() => {}).catch((error) => {
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
  }, [data, user.courses]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      
      {/* Sidebar */}
      <div className="w-[80px] md:w-[280px] lg:w-[320px] bg-white border-r border-slate-200 shrink-0 shadow-sm z-10">
        <div className="sticky top-[80px] h-[calc(100vh-80px)] overflow-y-auto overflow-x-hidden custom-scrollbar">
          <SideBarProfile
            user={user}
            active={active}
            avatar={avatar}
            setActive={setActive}
            logOutHandler={logOutHandler}
          />
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-x-hidden">
        <div className="max-w-5xl mx-auto p-6 md:p-10 lg:p-12 min-h-full">
          
          {/* My Account */}
          {active === 1 && (
            <div className="animate-fade-in w-full">
              <ProfileInfo user={user} avatar={avatar} />
            </div>
          )}
          
          {/* Change Password */}
          {active === 2 && (
            <div className="animate-fade-in w-full">
              <ChangePassword user={user} />
            </div>
          )}

          {/* Enrolled Courses */}
          {active === 3 && (
            <div className="animate-fade-in w-full">
              <div className="mb-8 border-b border-slate-200 pb-6">
                <h2 className="text-3xl font-bold text-slate-800 font-headingFont">
                  Enrolled Courses
                </h2>
                <p className="text-slate-500 mt-2 text-base">
                  Access and continue your learning journey here.
                </p>
              </div>
              
              {courses && courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {courses.map((item, index) => (
                    <CourseCard item={item} key={index} isProfile={true} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm mt-8">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">No Courses Enrolled</h3>
                  <p className="text-slate-500 text-base text-center max-w-md">
                    You haven't purchased any courses yet. Browse the catalog to find your next topic.
                  </p>
                </div>
              )}
            </div>
          )}
          
        </div>
      </div>

    </div>
  );
};

export default Profile;
