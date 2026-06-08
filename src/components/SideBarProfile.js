import React from "react";
import defaultAvatar from "../assets/user.png";
import { RiLockPasswordLine } from "react-icons/ri";
import {SiCoursera} from "react-icons/si";
import {AiOutlineLogout} from "react-icons/ai";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { Link } from "react-router-dom";
// import Hero from "../components/Hero"
const SideBarProfile = ({ user, active, avatar, setActive, logOutHandler }) => {
  return (
    <>
      <div className="w-full">
        <div
          className={`w-full flex items-center px-3 py-4 cursor-pointer  ${
            active === 1 ? " bg-slate-300" : "bg-transparent"
          }`} onClick={() => setActive(1)}
        >
          <img
            src={user.avatar || avatar ? user.avatar.url || avatar : defaultAvatar}
           width={20} height={20} className="w-[20px] h-[20px] 800px:w-[30px] 800px:h-[30px] cursor-pointer rounded-full"
          />
          <h5 className="pl-2 800px:block hidden font-poppins  text-black ">
            My Account
          </h5>
        </div>

        <div
          className={`w-full flex items-center px-3 py-4 cursor-pointer ${
            active === 2 ? " bg-slate-300" : "bg-transparent"
          }`} onClick={()=>setActive(2)}
        >
          <RiLockPasswordLine size={20} className=" text-black" />
          <h5 className="pl-2 800px:block hidden font-poppins  text-black ">Change Password</h5>
        </div>
        <div
          className={`w-full flex items-center px-3 py-4 cursor-pointer ${
            active === 3 ? " bg-slate-300" : "bg-transparent"
          }`} onClick={()=>setActive(3)}
        >
          <SiCoursera size={20} className=" text-black" />
          <h5 className="pl-2 800px:block hidden font-poppins  text-black ">Enrolled Courses</h5>
        </div>
        {user.role === "admin" && (
        <Link
          className={`w-full flex items-center px-3 py-4 cursor-pointer ${
            active === 6 ? " bg-white" : "bg-transparent"
          }`}
          to={"/admin"}
        >
          <MdOutlineAdminPanelSettings size={20} className=" text-black"  />
          <h5 className="pl-2 800px:block hidden font-Poppins  text-black">
            Admin Dashboard
          </h5>
        </Link>
      )}


        <div
          className={`w-full flex items-center px-3 py-4 cursor-pointer 
          `} onClick={()=>logOutHandler()}
        >
          <AiOutlineLogout size={20} className=" text-black" />
          <h5 className="pl-2 800px:block hidden font-poppins  text-black ">Log Out</h5>
        </div>
      </div>
    </>
  );
};

export default SideBarProfile;
