import React from "react";
import defaultAvatar from "../assets/user.png";
import { RiLockPasswordLine } from "react-icons/ri";
import { SiCoursera } from "react-icons/si";
import { AiOutlineLogout } from "react-icons/ai";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { Link } from "react-router-dom";

const SideBarProfile = ({ user, active, avatar, setActive, logOutHandler }) => {
  return (
    <div className="w-full h-full bg-white flex flex-col py-6">
      
      <div className="px-6 mb-8 hidden md:block">
        <h2 className="text-xl font-bold text-slate-800 font-headingFont">
          Settings
        </h2>
      </div>

      <div className="flex flex-col flex-1 px-3 space-y-1">
        
        {/* My Account */}
        <div
          className={`w-full flex items-center px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
            active === 1 
              ? "bg-blue-50 text-blue-700 font-semibold" 
              : "bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }`} 
          onClick={() => setActive(1)}
        >
          <img
            src={user.avatar || avatar ? user.avatar.url || avatar : defaultAvatar}
            alt="Profile Avatar"
            className="w-[24px] h-[24px] object-cover rounded-full border border-slate-200"
          />
          <h5 className="pl-3 hidden md:block font-sans text-[15px]">
            My Account
          </h5>
        </div>

        {/* Change Password */}
        <div
          className={`w-full flex items-center px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
            active === 2 
              ? "bg-blue-50 text-blue-700 font-semibold" 
              : "bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }`} 
          onClick={() => setActive(2)}
        >
          <RiLockPasswordLine size={22} className={active === 2 ? "text-blue-600" : "text-slate-400"} />
          <h5 className="pl-3 hidden md:block font-sans text-[15px]">
            Change Password
          </h5>
        </div>

        {/* Enrolled Courses */}
        <div
          className={`w-full flex items-center px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
            active === 3 
              ? "bg-blue-50 text-blue-700 font-semibold" 
              : "bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }`} 
          onClick={() => setActive(3)}
        >
          <SiCoursera size={22} className={active === 3 ? "text-blue-600" : "text-slate-400"} />
          <h5 className="pl-3 hidden md:block font-sans text-[15px]">
            Enrolled Courses
          </h5>
        </div>

        <div className="my-3 h-px bg-slate-100 mx-2"></div>

        {/* Admin Dashboard */}
        {user.role === "admin" && (
          <Link
            className="w-full flex items-center px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            to={"/admin"}
          >
            <MdOutlineAdminPanelSettings size={22} className="text-slate-500" />
            <h5 className="pl-3 hidden md:block font-sans text-[15px] font-medium">
              Admin Dashboard
            </h5>
          </Link>
        )}
      </div>

      {/* Log Out */}
      <div className="mt-auto px-3 pt-6">
        <div
          className="w-full flex items-center px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 bg-transparent text-red-500 hover:bg-red-50"
          onClick={() => logOutHandler()}
        >
          <AiOutlineLogout size={22} />
          <h5 className="pl-3 hidden md:block font-sans text-[15px] font-medium">
            Log Out
          </h5>
        </div>
      </div>
      
    </div>
  );
};

export default SideBarProfile;
