import React, { useState } from "react";
import ThemeSwitcher from "../../utils/ThemeSwitcher";
import { IoMdNotificationsOutline } from "react-icons/io";

const DashboardHeader = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full flex items-center justify-end p-6 fixed top-5 right-0">
      <ThemeSwitcher />
      <div
        className="relative cursor-pointer m-2"
        onClick={() => setOpen(!open)}
      >
        <IoMdNotificationsOutline className="text-2xl cursor-pointer  text-black" />
        <span className="absolute -top-2 -right-2 bg-[#0976DB] rounded-full w-[20px] h-[20px] text-[12px] flex items-center justify-center text-white">
          3
        </span>
      </div>
      {open && (
        <div className="w-[350px] h-[50vh]  bg-white shadow-xl absolute top-16 z-10 rounded">
          <h5 className="text-center text-[20px] font-poppins text-black  p-3">
            Notifications
          </h5>
          <div className=" bg-[#00000013] font-poppins border-b  border-b-[#0000000f]">
            <div className="w-full flex items-center justify-between p-2">
              <p className="text-black ">
                New question received
              </p>
              <p className="text-black  cursor-pointer">
                Mark as read
              </p>
            </div>
            <p className="px-2 text-black ">
              here are many variations of passages of Lorem Ipsum available, but
             
            </p>
            <p className="p-2 text-[14px] text-black  cursor-pointer">
              5 days ago
            </p>
          </div>
          <div className=" bg-[#00000013] font-poppins border-b  border-b-[#0000000f]">
            <div className="w-full flex items-center justify-between p-2">
              <p className="text-black ">
                New question received
              </p>
              <p className="text-black  cursor-pointer">
                Mark as read
              </p>
            </div>
            <p className="px-2 text-black ">
              here are many variations of passages of Lorem Ipsum available, but
              the majority have suffered
            </p>
            <p className="p-2 text-[14px] text-black  cursor-pointer">
              5 days ago
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
