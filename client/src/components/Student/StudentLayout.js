import React, { useState } from "react";
import { useSelector } from "react-redux";
import SideBarProfile from "../SideBarProfile";
import Protected from "../../utils/hooks/useProtected";
import Header from "../Header";
import { Outlet, useLocation, Link } from "react-router-dom";

const StudentLayout = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(5);
  const [route, setRoute] = useState("Login");
  const { user } = useSelector((state) => state.auth);
  
  const location = useLocation();
  const path = location.pathname;

  let active = 0;
  if (path.includes("dashboard")) active = 0;
  if (path.includes("settings")) active = 1;
  if (path.includes("courses")) active = 3;
  if (path.includes("favorites")) active = 4;
  if (path.includes("neet")) active = 5;

  return (
    <Protected>
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />
      <div className="flex min-h-[calc(100vh-80px)] bg-[#0B0F19] text-slate-300 font-sans pt-[0px]">
        {/* Sidebar */}
        <div className="w-[80px] md:w-[280px] lg:w-[320px] bg-[#0B0F19] border-r border-white/10 shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.5)] z-10 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
          <div className="sticky top-[0px] h-full overflow-y-auto scrollbar-hide relative z-10">
            <SideBarProfile user={user} active={active} />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 relative">
          {/* Background ambient glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full"></div>
          </div>

          <div className="max-w-[1600px] mx-auto p-6 md:p-10 lg:p-12 min-h-full relative z-10">
            <Outlet />
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#0B0F19]/90 backdrop-blur-xl border-t border-white/10 z-50 px-2 py-3 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
          <div className="flex justify-around items-center">
            <Link to="/profile/dashboard" className={`flex flex-col items-center gap-1 ${active === 0 ? "text-primary" : "text-slate-500"}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
              <span className="text-[10px] font-bold">Home</span>
            </Link>
            <Link to="/profile/courses" className={`flex flex-col items-center gap-1 ${active === 3 ? "text-primary" : "text-slate-500"}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
              <span className="text-[10px] font-bold">Courses</span>
            </Link>
            <button className={`flex flex-col items-center gap-1 text-slate-500`}>
              <div className="relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-[#0B0F19]"></span>
              </div>
              <span className="text-[10px] font-bold">Alerts</span>
            </button>
            <Link to="/profile/settings" className={`flex flex-col items-center gap-1 ${active === 1 ? "text-primary" : "text-slate-500"}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              <span className="text-[10px] font-bold">Settings</span>
            </Link>
          </div>
        </div>

      </div>
    </Protected>
  );
};

export default StudentLayout;
