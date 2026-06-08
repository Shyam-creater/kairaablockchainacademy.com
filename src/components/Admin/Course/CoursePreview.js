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
    <div className="w-[90%] m-auto py-5 mb-5">
      <div className="w-full relative ">
        <div className="w-full mt-10">
          <CoursePlayer
            videoUrl={courseData?.demoUrl}
            title={courseData?.title}
          />
        </div>
        <div className="flex items-center">
          <h1 className="pt-5 text-[25px]">
            {courseData?.price === 0 ? "Free" : courseData?.price + " ₹"}
          </h1>
          <h5 className="pl-3 text-[20px] mt-2 line-through opacity-80">
            {courseData.estimatedPrice} ₹
          </h5>
          <h4 className="pl-5 pt-4 text-[22px]">
            {discountPercentagePrice}% Off
          </h4>
        </div>
        <div className="flex items-center">
          <div
            className={`${styles.button} !w-[180px] my-3 font-poppins !bg-[crimson] cursor-not-allowed`}
          >
            Buy Now {courseData?.price}₹
          </div>
        </div>
        <div className="flex items-center">
          <input
            type="text"
            name=""
            id=""
            placeholder="Dicount code..."
            className={`${styles.input} 1500px:!w-[50%] 1100px:w-[60%] ml-3 !mt-0`}
          />
          <div
            className={`${styles.button} !w-[120px] my-3 ml-4 font-poppins cursor-pointer`}
          >
            Apply
          </div>
        </div>
        <p className="pb-1">• Full lifetime access</p>
        <p className="pb-1">• Certificate of completion</p>
        <p className="pb-1">• Premium support</p>
      </div>
      <div className="w-full">
        <div className="w-full 800px:pr-5">
          <h1 className="text-[25px] font-poppins font-bold">
            {courseData?.name}
          </h1>

          <div className="flex items-center justify-between pt-3">
            <div className="flex items-center">
              <Ratings rating={0} />
              <h5>0 Reviews</h5>
            </div>
            <h5>0 students</h5>
          </div>
          <br />
          <h1 className="text-[25px] font-poppins font-bold">
            Whay you will learn from this course?
          </h1>
        </div>
        {courseData?.benefits?.map((item, index) => (
          <div className="w-full flex 800px:items-center py-2" key={index}>
            <div className="w-[15px] mr-1">
              <IoCheckmarkDoneOutline size={20} />
            </div>
            <p className="pl-2">{item.title}</p>
          </div>
        ))}
        <br />
        <br />
        <h1 className="text-[25px] font-poppins font-bold">
          Whay are the prerequisite for starting this course?
        </h1>
        {courseData?.prerequisites?.map((item, index) => (
          <div className="w-full flex 800px:items-center py-2" key={index}>
            <div className="w-[15px] mr-1">
              <IoCheckmarkDoneOutline size={20} />
            </div>
            <p className="pl-2">{item.title}</p>
          </div>
        ))}
        <br />
        <br />
        <div className="w-full">
          <h1 className="text-[25px] font-poppins font-bold">Course Details</h1>
          <p className="text-[18px] mt-[20px] whitespace-pre-line w-full overflow-hidden">
            {" "}
            {courseData?.description}
          </p>
        </div>
        <br />
        <br />
        <div className="w-full flex items-center justify-between gap-12">
          <div
            className="w-full 800px:w-[180px] h-[40px] bg-blue-500 flex items-center justify-center text-center text-[#fff] rounded mt-8 cursor-pointer"
            onClick={() => prevButton()}
          >
            prev
          </div>
          <div
            className="w-full 800px:w-[180px] h-[40px]  bg-blue-500 flex items-center justify-center text-center text-[#fff] rounded mt-8 cursor-pointer"
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
