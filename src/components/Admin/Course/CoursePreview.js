import React from "react";
import CoursePlayer from "../../../utils/CoursePlayer.js";
import { styles } from "../../../styles/style.js";
import Ratings from "./Ratings.js";
import { IoCheckmarkDoneOutline } from "react-icons/io5";

const CoursePreview = ({
  isEdit,
  active,
  setActive,
  courseData,
  handleCourseCreate,
}) => {
  const discountPercentage =
    ((courseData?.estimatedPrice - courseData?.price) /
      courseData?.estimatedPrice) *
    100;
  const discountPercentagePrice = discountPercentage.toFixed(0);

  const prevButton = () => {
    setActive(active - 1);
  };

  const createCourse = () => {
    handleCourseCreate();
  };

  return (
    <div className="w-full glass-panel p-6 800px:p-10 block">
      <div className="w-full relative ">
        <div className="w-full mt-2 rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/5">
          <CoursePlayer
            videoUrl={courseData?.demoUrl}
            title={courseData?.title}
          />
        </div>
        <div className="flex items-center">
          <h1 className="pt-5 text-[25px] font-bold text-white">
            {courseData?.price === 0 ? "Free" : courseData?.price + " ₹"}
          </h1>
          <h5 className="pl-3 text-[20px] mt-2 line-through text-slate-500">
            {courseData.estimatedPrice} ₹
          </h5>
          <h4 className="pl-5 pt-4 text-[22px] font-bold text-success">
            {discountPercentagePrice}% Off
          </h4>
        </div>
        <div className="flex items-center">
          <div
            className="w-full 800px:w-[180px] flex items-center justify-center h-[45px] bg-danger/20 text-danger border border-danger/50 font-bold uppercase tracking-widest rounded-lg cursor-not-allowed mt-4 opacity-70"
          >
            Buy Now {courseData?.price}₹
          </div>
        </div>
        <div className="flex items-center mt-6 mb-6">
          <input
            type="text"
            name=""
            id=""
            placeholder="Discount code..."
            className="w-[60%] 800px:w-[50%] h-[45px] bg-black/20 border border-slate-600 rounded-lg px-4 text-white text-sm outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all placeholder:text-slate-500"
          />
          <div
            className="w-[120px] h-[45px] flex items-center justify-center bg-primary/20 text-primary border border-primary/50 font-bold uppercase tracking-widest rounded-lg hover:bg-primary hover:text-slate-900 transition-all cursor-pointer ml-4"
          >
            Apply
          </div>
        </div>
        <p className="pb-1 text-slate-300">• Full lifetime access</p>
        <p className="pb-1 text-slate-300">• Certificate of completion</p>
        <p className="pb-1 text-slate-300">• Premium support</p>
      </div>
      <div className="w-full mt-10">
        <div className="w-full 800px:pr-5">
          <h1 className="text-[25px] font-bold text-white mb-2">
            {courseData?.name}
          </h1>

          <div className="flex items-center justify-between pt-3 text-slate-400">
            <div className="flex items-center">
              <Ratings rating={0} />
              <h5 className="ml-2">0 Reviews</h5>
            </div>
            <h5>0 students</h5>
          </div>
          <br />
          <h1 className="text-[25px] font-bold text-white mt-8 mb-4">
            What you will learn from this course?
          </h1>
        </div>
        {courseData?.benefits?.map((item, index) => (
          <div className="w-full flex 800px:items-center py-2 text-slate-300" key={index}>
            <div className="w-[15px] mr-2 text-primary">
              <IoCheckmarkDoneOutline size={20} />
            </div>
            <p className="pl-2">{item.title}</p>
          </div>
        ))}
        <br />
        <h1 className="text-[25px] font-bold text-white mt-8 mb-4">
          What are the prerequisites for starting this course?
        </h1>
        {courseData?.prerequisites?.map((item, index) => (
          <div className="w-full flex 800px:items-center py-2 text-slate-300" key={index}>
            <div className="w-[15px] mr-2 text-primary">
              <IoCheckmarkDoneOutline size={20} />
            </div>
            <p className="pl-2">{item.title}</p>
          </div>
        ))}
        <br />
        <div className="w-full mt-8">
          <h1 className="text-[25px] font-bold text-white mb-4">Course Details</h1>
          <p className="text-[16px] text-slate-300 whitespace-pre-line w-full overflow-hidden leading-relaxed">
            {courseData?.description}
          </p>
        </div>
        <br />
        <div className="w-full flex flex-col 800px:flex-row items-center justify-between gap-4 800px:gap-12 mt-12 mb-4">
          <div
            className="w-full 800px:w-[180px] flex items-center justify-center h-[45px] bg-white/5 text-white border border-slate-600 font-bold uppercase tracking-widest rounded-lg hover:bg-white/10 transition-all cursor-pointer"
            onClick={() => prevButton()}
          >
            Previous
          </div>
          <div
            className="w-full 800px:w-[220px] flex items-center justify-center h-[50px] bg-gradient-to-r from-success to-primary text-slate-900 font-bold uppercase tracking-widest rounded-lg shadow-[0_0_20px_rgba(0,242,254,0.5)] hover:scale-105 hover:shadow-[0_0_30px_rgba(0,242,254,0.8)] transition-all cursor-pointer"
            onClick={() => createCourse()}
          >
           {
            isEdit ? "Update Course": "Create Course"
           }
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePreview;
