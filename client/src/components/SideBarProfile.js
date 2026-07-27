import React from "react";
import defaultAvatar from "../assets/user.png";
import { RiLockPasswordLine } from "react-icons/ri";
import { SiCoursera } from "react-icons/si";
import { AiOutlineLogout } from "react-icons/ai";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { HiOutlineUser, HiOutlineViewGrid } from "react-icons/hi";
import { FiHeart } from "react-icons/fi";
import { Link } from "react-router-dom";

const SideBarProfile = ({ user, active, avatar, setActive, logOutHandler }) => {
  return (
    <div className="w-full h-full flex flex-col py-6 relative">
      
      <div className="px-6 mb-8 hidden md:block">
        <h2 className="text-xs font-bold text-primary uppercase tracking-widest">
          Learning OS
        </h2>
      </div>

      <div className="flex flex-col flex-1 px-4 space-y-2">
        
        {/* Dashboard */}
        <Link
          to="/profile/dashboard"
          className={`w-full flex items-center px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-300 group ${
            active === 0 
              ? "bg-primary/10 border border-primary/30 shadow-[0_0_15px_rgba(0,242,254,0.1)]" 
              : "bg-transparent border border-transparent hover:bg-white/5 hover:border-white/10"
          }`} 
        >
          <HiOutlineViewGrid size={22} className={`transition-colors duration-300 ${active === 0 ? "text-primary drop-shadow-[0_0_8px_rgba(0,242,254,0.8)]" : "text-slate-400 group-hover:text-white"}`} />
          <h5 className={`pl-4 hidden md:block font-bold text-[15px] transition-colors duration-300 ${active === 0 ? "text-primary" : "text-slate-400 group-hover:text-white"}`}>
            Dashboard
          </h5>
        </Link>

        {/* Enrolled Courses */}
        <Link
          to="/profile/courses"
          className={`w-full flex items-center px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-300 group ${
            active === 3 
              ? "bg-primary/10 border border-primary/30 shadow-[0_0_15px_rgba(0,242,254,0.1)]" 
              : "bg-transparent border border-transparent hover:bg-white/5 hover:border-white/10"
          }`} 
        >
          <SiCoursera size={20} className={`transition-colors duration-300 ${active === 3 ? "text-primary drop-shadow-[0_0_8px_rgba(0,242,254,0.8)]" : "text-slate-400 group-hover:text-white"}`} />
          <h5 className={`pl-4 hidden md:block font-bold text-[15px] transition-colors duration-300 ${active === 3 ? "text-primary" : "text-slate-400 group-hover:text-white"}`}>
            My Courses
          </h5>
        </Link>

        {/* NEET Question Banks */}
        <Link
          to="/profile/neet"
          className={`w-full flex items-center px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-300 group ${
            active === 5 
              ? "bg-primary/10 border border-primary/30 shadow-[0_0_15px_rgba(0,242,254,0.1)]" 
              : "bg-transparent border border-transparent hover:bg-white/5 hover:border-white/10"
          }`} 
        >
          <SiCoursera size={20} className={`transition-colors duration-300 ${active === 5 ? "text-primary drop-shadow-[0_0_8px_rgba(0,242,254,0.8)]" : "text-slate-400 group-hover:text-white"}`} />
          <h5 className={`pl-4 hidden md:block font-bold text-[15px] transition-colors duration-300 ${active === 5 ? "text-primary" : "text-slate-400 group-hover:text-white"}`}>
            NEET Prep
          </h5>
        </Link>

        <div className="my-4 h-px bg-white/5 mx-2 hidden md:block"></div>

        {/* Settings Hub */}
        <Link
          to="/profile/settings"
          className={`w-full flex items-center px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-300 group ${
            active === 1 
              ? "bg-primary/10 border border-primary/30 shadow-[0_0_15px_rgba(0,242,254,0.1)]" 
              : "bg-transparent border border-transparent hover:bg-white/5 hover:border-white/10"
          }`} 
        >
          <HiOutlineUser size={22} className={`transition-colors duration-300 ${active === 1 ? "text-primary drop-shadow-[0_0_8px_rgba(0,242,254,0.8)]" : "text-slate-400 group-hover:text-white"}`} />
          <h5 className={`pl-4 hidden md:block font-bold text-[15px] transition-colors duration-300 ${active === 1 ? "text-primary" : "text-slate-400 group-hover:text-white"}`}>
            Settings Hub
          </h5>
        </Link>

        <div className="my-4 h-px bg-white/5 mx-2"></div>

        {/* Admin/Staff Dashboard Link */}
        {(user.role === "admin" || user.role === "staff") && (
          <Link
            className="w-full flex items-center px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] group mb-2"
            to={user.role === "admin" ? "/admin" : "/staff"}
          >
            <MdOutlineAdminPanelSettings size={22} className="text-amber-500 group-hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
            <h5 className="pl-4 hidden md:block font-bold text-[15px] text-amber-500">
              {user.role === "admin" ? "Admin Portal" : "Staff Portal"}
            </h5>
          </Link>
        )}

      </div>
      
      {/* Mini Profile Info at Bottom */}
      <div className="mt-auto px-4 pb-4 hidden md:block">
        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
           <img
            src={user.avatar || avatar ? user.avatar.url || avatar : defaultAvatar}
            alt="Profile Avatar"
            className="w-10 h-10 object-cover rounded-full border border-primary/50 shadow-[0_0_10px_rgba(0,242,254,0.2)]"
          />
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-white truncate">{user.name}</p>
            <p className="text-xs text-slate-400 truncate">Student</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SideBarProfile;

