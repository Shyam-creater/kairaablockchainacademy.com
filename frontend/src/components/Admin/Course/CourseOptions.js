import React from "react";
import { IoMdCheckmark } from "react-icons/io";

const CourseOptions = ({ active, setActive }) => {
  const options = [
    "Course Information",
    "Course Options",
    "Course Content",
    "Course Preview",
  ];

  return (
    <div>
      {options.map((option, index) => (
        <div key={index} className={`w-full flex 800px:py-5 py-2`}>
          <div
            className={`800px:w-[35px] w-[20px] h-[20px] 800px:h-[35px] rounded-full flex items-center justify-center ${
              active + 1 > index ? "bg-blue-500" : "bg-[#384766]"
            } relative`}
          >
            <IoMdCheckmark className="text-[25px]" />
            {index !== options.length-1 && (
              <div
                className={`absolute 800px:h-[30px] h-[20px] w-1 ${
                  active + 1 > index ? "bg-blue-500" : "bg-[#384766]"
                } bottom-[-100%]`}
              />
            )}
          </div>
          <h5
            className={`pl-3 ${
              active === index
                ? " text-black"
                : " text-black"
            } 800px:text-[20px] text-[15px]`}
          >
            {option}
          </h5>
        </div>
      ))}
    </div>
  );
};

export default CourseOptions;
