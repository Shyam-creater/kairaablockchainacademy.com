import React from "react";
import Step1BasicInfo from "./Steps/Step1BasicInfo.js";
import Step2Pricing from "./Steps/Step2Pricing.js";
import Step3CourseOverview from "./Steps/Step3CourseOverview.js";
import Step4StudentOutcomes from "./Steps/Step4StudentOutcomes.js";
import Step6CurriculumPreview from "./Steps/Step6CurriculumPreview.js";
import Step8Tools from "./Steps/Step8Tools.js";
import Step9Instructor from "./Steps/Step9Instructor.js";
import Step10Trust from "./Steps/Step10Trust.js";
import Step11SEO from "./Steps/Step11SEO.js";
import Step13Resources from "./Steps/Step13Resources.js";
import Step14Visibility from "./Steps/Step14Visibility.js";

const CourseSteps = ({ activeStep, courseData, setCourseData }) => {
  switch (activeStep) {
    case 1:
      return <Step1BasicInfo courseData={courseData} setCourseData={setCourseData} />;
    case 2:
      return <Step2Pricing courseData={courseData} setCourseData={setCourseData} />;
    case 3:
      return <Step3CourseOverview courseData={courseData} setCourseData={setCourseData} />;
    case 4:
      return <Step4StudentOutcomes courseData={courseData} setCourseData={setCourseData} />;
    case 5:
      return <Step6CurriculumPreview courseData={courseData} setCourseData={setCourseData} />;
    case 6:
      return <Step8Tools courseData={courseData} setCourseData={setCourseData} />;
    case 7:
      return <Step9Instructor courseData={courseData} setCourseData={setCourseData} />;
    case 8:
      return <Step10Trust courseData={courseData} setCourseData={setCourseData} />;
    case 9:
      return <Step11SEO courseData={courseData} setCourseData={setCourseData} />;
    case 10:
      return <Step13Resources courseData={courseData} setCourseData={setCourseData} />;
    case 11:
      return <Step14Visibility courseData={courseData} setCourseData={setCourseData} />;
    default:
      return <div>Unknown Step</div>;
  }
};

export default CourseSteps;
