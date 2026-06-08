import Ratings from "../Admin/Course/Ratings.js";
import React, { FC } from "react";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { Link } from "react-router-dom";

const CourseCard = ({ item, isProfile }) => {
  return (
    <Link
      to={!isProfile ? `/courses/${item._id}` : `course-access/${item._id}`}
    >
        {/* transition-transform duration-1000 ease-in-out hover:scale-110 group-hover:filter */}
      <div className="p-2  shadow-lg bg-slate-100 rounded-md 
    transition-transform duration-1000 ease-in-out hover:scale-110 group-hover:filter
      ">
        <img
          src={item?.thumbnail?.url}
          width={600}
          height={300}
          className="rounded w-full h-full object-cover"
          alt="course-banner"
        />
        <br />
        <div className="flex flex-col gap-4 items-center justify-center ">
          <h1 className="font-Poppins text-xl text-black font-bold text-center">
            {item.name}
          </h1>
          <button className="bg-gradient-to-r from-cyan-500 to-[#CB77F7] text-lg text-white rounded p-3 hover:bg-blue-600 mx-4 my-2">
            Enroll Now
          </button>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
