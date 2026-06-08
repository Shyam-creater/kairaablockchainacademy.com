
import React from "react";
import { styles } from "../../../styles/style";
import { SlPlus } from "react-icons/sl";
import { toast } from "react-hot-toast";

const CourseData = ({
  benefits,
  setBenefits,
  prerequisites,
  setPrerequisites,
  active,
  setActive,
}) => {
  const handleBenefitsChange = (index, value) => {
    const updatedBenefits = benefits.map((benefit, i) =>
      i === index ? { ...benefit, title: value } : benefit
    );
    setBenefits(updatedBenefits);
  };

  const handleAddBenefits = () => {
    setBenefits([...benefits, { title: "" }]);
  };

  const handlePrerequisitesChange = (index, value) => {
    const updatedPrerequisites = prerequisites.map((prerequisite, i) =>
      i === index ? { ...prerequisite, title: value } : prerequisite
    );
    setPrerequisites(updatedPrerequisites);
  };

  const handleAddPrerequisites = () => {
    setPrerequisites([...prerequisites, { title: "" }]);
  };

  const prevButton = () => {
    setActive(active - 1);
  };

  const handleOptions = () => {
    if (
      benefits[benefits.length - 1]?.title !== "" &&
      prerequisites[prerequisites.length - 1]?.title !== ""
    ) {
      setActive(active + 1);
    } else {
      toast.error("Please fill in the fields to proceed to the next step");
    }
  };

  return (
    <div className="w-[80%] m-auto mt-24 block">
      <div>
        <label className={`${styles.label} text-[20px]`} htmlFor="">
          What are the benefits for students in this course?
        </label>
        <br />
        {benefits.map((benefit, index) => (
          <input
            type="text"
            key={index}
            name="benefit"
            placeholder="enter the benefits..."
            required
            className={`${styles.input} my-2`}
            value={benefit.title}
            onChange={(e) => handleBenefitsChange(index, e.target.value)}
          />
        ))}
        <SlPlus
          style={{ margin: "10px 0px", cursor: "pointer", width: "30px" }}
          onClick={handleAddBenefits}
        />
      </div>
      <div>
        <label className={`${styles.label} text-[20px]`} htmlFor="">
          What are the prerequisites for this course?
        </label>
        <br />
        {prerequisites.map((prerequisite, index) => (
          <input
            type="text"
            key={index}
            name="prerequisite"
            placeholder="enter the prerequisites..."
            required
            className={`${styles.input} my-2`}
            value={prerequisite.title}
            onChange={(e) => handlePrerequisitesChange(index, e.target.value)}
          />
        ))}
        <SlPlus
          style={{ margin: "10px 0px", cursor: "pointer", width: "30px" }}
          onClick={handleAddPrerequisites}
        />
      </div>
      <br />
      <div className="w-full flex items-center justify-between gap-12">
        <div
          className="w-full 800px:w-[180px] h-[40px] bg-blue-500 flex items-center justify-center text-center text-[#fff] rounded mt-8 cursor-pointer"
          onClick={() => prevButton()}>
          prev
        </div>
        <div
          className="w-full 800px:w-[180px] h-[40px]  bg-blue-500 flex items-center justify-center text-center text-[#fff] rounded mt-8 cursor-pointer"
          onClick={() => handleOptions()}>
          Next
        </div>
      </div>
      <br />
      <br />
    </div>
  );
};

export default CourseData;
