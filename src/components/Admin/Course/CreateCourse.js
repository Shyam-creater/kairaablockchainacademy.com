import React, { useEffect, useState } from "react";
import CourseInformation from "./CourseInformation.js";
import CourseOptions from "./CourseOptions.js";
import CourseData from "./CourseData.js";
import CourseContent from "./CourseContent.js";
import CoursePreview from "./CoursePreview.js";
import { useCreateCourseMutation } from "../../../redux/features/courses/coursesApi.js";
import toast from "react-hot-toast";

import { useNavigate } from "react-router-dom";

const CreateCourse = () => {
  const navigate = useNavigate();
  const [createCourse, { isSuccess, error, isLoading }] =useCreateCourseMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Course created successfully!");
      navigate("/admin/courses")
    }

    if (error) {
      if ("data" in error) {
        const errorMessage = error;
        toast.error(errorMessage.data.message);
      }
    }
  }, [isSuccess, isLoading, error]);

  

  const [active, setActive] = useState(0);
  const [courseInfo, setCourseInfo] = useState({
    name: "",
    description: "",
    price: "",
    estimatedPrice: "",
    tags: "",
    level: "",
    demoUrl: "",
    thumbnail: "",
    duration: "",
    language: "English",
    certificate: true,
    syllabusUrl: "",
  });
  const [benefits, setBenefits] = useState([{ title: "" }]);
  const [prerequisites, setPrerequisites] = useState([{ title: "" }]);
  const [courseContentData, setCourseContentData] = useState([
    {
      videoUrl: "",
      title: "",
      description: "",
      videoSection: "Untitled Section",
      links: [
        {
          title: "",
          url: "",
        },
      ],
      suggestion: "",
    },
  ]);
  const [courseData, setCourseData] = useState({});

  const handleSubmit = async () => {
    // format benefits array
    const formattedBenefits = benefits.map((benefit) => ({
      title: benefit.title,
    }));
    // formatted prerequisites
    const formattedPrerequisites = prerequisites.map((prerequisite) => ({
      title: prerequisite.title,
    }));

    // format course content array
    const formattedCourseContentData = courseContentData.map(
      (courseContent) => ({
        videoUrl: courseContent.videoUrl,
        title: courseContent.title,
        description: courseContent.description,
        videoSection: courseContent.videoSection,
        links: courseContent.links.map((link) => ({
          title: link.title,
          url: link.url,
        })),
        suggestion: courseContent.suggestion,
      })
    );
    // prepare our data object
    const data = {
      name: courseInfo.name,
      description: courseInfo.description,
      price: courseInfo.price,
      estimatedPrice: courseInfo.estimatedPrice,
      tags: courseInfo.tags,
      thumbnail: courseInfo.thumbnail,
      level: courseInfo.level,
      demoUrl: courseInfo.demoUrl,
      duration: courseInfo.duration,
      language: courseInfo.language,
      certificate: courseInfo.certificate,
      syllabusUrl: courseInfo.syllabusUrl,
      totalVideos: courseContentData.length,
      benefits: formattedBenefits,
      prerequisites: formattedPrerequisites,
      courseContentData: formattedCourseContentData,
    };
    setCourseData(data);
  };
 
  const handleCourseCreate = async () => {
    const data = courseData;

    if(!isLoading){
      await createCourse(data);
    }
    
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col min-h-screen py-10 px-4">
      {/* Top 4-Step Tracking Bar */}
      <div className="w-full mb-8">
        <CourseOptions active={active} setActive={setActive} />
      </div>

      {/* Main Form Content */}
      <div className="w-full">
        {active === 0 && (
          <CourseInformation
            courseInfo={courseInfo}
            setCourseInfo={setCourseInfo}
            active={active}
            setActive={setActive}
          />
        )}
        {active === 1 && (
          <CourseData
            benefits={benefits}
            setBenefits={setBenefits}
            prerequisites={prerequisites}
            setPrerequisites={setPrerequisites}
            active={active}
            setActive={setActive}
          />
        )}
        {active === 2 && (
          <CourseContent
            courseContentData={courseContentData}
            setCourseContentData={setCourseContentData}
            active={active}
            setActive={setActive}
            handleSubmit={handleSubmit}
          />
        )}
        {active === 3 && (
          <CoursePreview
            courseData={courseData}
            active={active}
            setActive={setActive}
            handleCourseCreate={handleCourseCreate}
          />
        )}
      </div>
    </div>
  );
};

export default CreateCourse;
