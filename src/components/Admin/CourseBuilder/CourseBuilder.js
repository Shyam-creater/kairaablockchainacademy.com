import React, { useState, useEffect } from "react";
import { useCreateCourseMutation, useEditCourseMutation, useGetAllCoursesQuery } from "../../../redux/features/courses/coursesApi.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import CourseSteps from "./CourseSteps.js";
import { motion, AnimatePresence } from "framer-motion";

const CourseBuilder = ({ id }) => {
  const navigate = useNavigate();
  const [createCourse, { isSuccess, error, isLoading }] = useCreateCourseMutation();
  const [editCourse, { isSuccess: isEditSuccess, error: editError, isLoading: isEditLoading }] = useEditCourseMutation();
  
  const { data } = useGetAllCoursesQuery(
    {},
    { skip: !id, refetchOnMountOrArgChange: true }
  );

  const [activeStep, setActiveStep] = useState(1);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev
  const [saveProgress, setSaveProgress] = useState(0);

  const [courseData, setCourseData] = useState({
    name: "", subtitle: "", description: "", thumbnail: "", promoVideo: "", category: "", subcategory: "", level: "", language: "English", status: "Draft", courseType: "Self Paced", visibility: "Public", version: "1.0",
    price: "", estimatedPrice: "", discountPercentage: "", currency: "INR", offerEndDate: "", emiAvailable: false, freePreview: false, refundPolicy: "", lifetimeAccess: true, certificate: { enabled: true, type: "Completion" }, featured: false, bestseller: false, newCourseBadge: false,
    duration: "", projectsCount: 0, assignmentCount: 0, quizCount: 0, downloadableResourcesCount: 0, communityAccess: false, mobileAccess: true, desktopAccess: true, offlineAccess: false, estimatedStudyHours: "", weeklyStudyHours: "",
    learningOutcomes: [{ title: "" }], prerequisites: [{ title: "" }], careerPaths: [{ title: "", expectedSalary: "" }],
    courseContentData: [{ videoUrl: "", title: "", description: "", videoSection: "Untitled Section", resources: [{ title: "", url: "" }], suggestion: "" }],
    toolsCovered: [],
    seo: { metaTitle: "", metaDescription: "", keywords: "", openGraphImage: "", canonicalUrl: "" },
    brochure: "", roadmapPdf: "", sampleNotes: "", syllabusUrl: "",
    enrollmentStart: "", enrollmentEnd: "", maximumStudents: "", waitlistEnabled: false,
  });

  const steps = [
    { id: 1, title: "Course Essentials" },
    { id: 2, title: "Monetization" },
    { id: 3, title: "Program Overview" },
    { id: 4, title: "Learning Outcomes" },
    { id: 5, title: "Curriculum Design" },
    { id: 6, title: "Tools & Technologies" },
    { id: 7, title: "Instructor Profile" },
    { id: 8, title: "Social Proof" },
    { id: 9, title: "Search Optimization" },
    { id: 10, title: "Course Materials" },
    { id: 11, title: "Publishing Settings" },
  ];

  useEffect(() => {
    if (id && data) {
      const editCourseData = data.courses.find((i) => i._id === id);
      if (editCourseData) {
        // Only set values that exist in editCourseData, map benefits to learningOutcomes if needed, etc.
        setCourseData((prev) => ({
          ...prev,
          ...editCourseData,
          thumbnail: editCourseData?.thumbnail?.url || prev.thumbnail,
          learningOutcomes: editCourseData.benefits || prev.learningOutcomes,
        }));
      }
    }
  }, [id, data]);

  useEffect(() => {
    if (isSuccess || isEditSuccess) {
      toast.success(id ? "Course updated successfully!" : "Course created successfully!");
      navigate("/admin/courses");
    }
    if (error) {
      if ("data" in error) {
        toast.error(error.data.message);
      }
    }
    if (editError) {
      if ("data" in editError) {
        toast.error(editError.data.message);
      }
    }
  }, [isSuccess, error, isEditSuccess, editError, navigate, id]);

  useEffect(() => {
    // Auto-save logic (mock for now)
    const interval = setInterval(() => {
      setSaveProgress((prev) => (prev < 100 ? prev + 10 : 100));
      if (saveProgress === 100) {
        setTimeout(() => setSaveProgress(0), 2000);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [saveProgress]);

  const handleNext = () => {
    if (activeStep < 11) {
      setDirection(1);
      setActiveStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeStep > 1) {
      setDirection(-1);
      setActiveStep((prev) => prev - 1);
    }
  };

  const jumpToStep = (id) => {
    setDirection(id > activeStep ? 1 : -1);
    setActiveStep(id);
  };

  const handleSubmit = async () => {
    if (!isLoading && !isEditLoading) {
      if (id) {
        await editCourse({ id, data: courseData });
      } else {
        await createCourse(courseData);
      }
    }
  };

  const variants = {
    enter: (direction) => {
      return {
        x: direction > 0 ? 30 : -30,
        opacity: 0
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 30 : -30,
        opacity: 0
      };
    }
  };

  return (
    <div className="w-full flex min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] font-sans overflow-hidden">
      {/* Left Sidebar Stepper - Linear/Notion Style */}
      <div className="w-[280px] border-r border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-[#111111]/50 backdrop-blur-xl sticky top-0 h-screen overflow-y-auto p-6 hidden md:flex flex-col">
        <div className="mb-8">
          <h2 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Academy OS</h2>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Course Builder</h1>
          
          {/* Innovative Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider">
              <span className="text-gray-500">Progress</span>
              <span className="text-blue-600 dark:text-blue-400">{Math.round(((activeStep - 1) / 10) * 100)}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((activeStep - 1) / 10) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
        
        <div className="flex-1 relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-gray-100 dark:bg-gray-800/80 rounded-full" />
          
          <div className="space-y-1.5 relative">
            {steps.map((step) => {
              const isActive = activeStep === step.id;
              const isCompleted = activeStep > step.id;
              return (
                <div 
                  key={step.id} 
                  onClick={() => jumpToStep(step.id)}
                  className={`flex items-center gap-4 px-2 py-2 cursor-pointer transition-all duration-300 group ${
                    isActive 
                      ? "text-gray-900 dark:text-white font-medium" 
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  }`}
                >
                  <div className={`relative flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold z-10 transition-all duration-300 ${
                    isActive 
                      ? "border-2 border-blue-500 bg-white dark:bg-[#111111] text-blue-600 dark:text-blue-400 shadow-[0_0_12px_rgba(0,0,0,0.15)] dark:shadow-[0_0_12px_rgba(255,255,255,0.15)] scale-110"
                      : isCompleted
                      ? "border-2 border-blue-500 bg-blue-500 text-white dark:text-black"
                      : "border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111111] text-gray-400 dark:text-gray-500 group-hover:border-gray-400"
                  }`}>
                    {isCompleted ? (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step.id
                    )}
                  </div>
                  <span className={`text-[13px] ${isActive ? 'translate-x-1 font-bold text-blue-600 dark:text-blue-400' : ''} transition-transform`}>{step.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Auto Save Indicator */}
        <div className="mt-6 flex items-center gap-2 px-3">
          <div className="relative flex h-2 w-2">
            {saveProgress < 100 && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${saveProgress === 100 ? 'bg-gray-400' : 'bg-blue-500'}`}></span>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
            {saveProgress === 100 ? "Draft saved" : "Saving..."}
          </p>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 overflow-y-auto relative">
        <div className="max-w-[800px] mx-auto p-4 md:p-12 pb-32">
          
          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-between mb-8 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md p-4 rounded-md border border-gray-200/50 dark:border-gray-800/50">
            <span className="text-[11px] font-bold text-gray-500 tracking-widest uppercase">Step {activeStep}/11</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{steps.find(s => s.id === activeStep)?.title}</span>
          </div>

          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white tracking-tight mb-3">
              {steps.find(s => s.id === activeStep)?.title}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Complete the details below to structure your premium course.
            </p>
          </div>

          <div className="min-h-[400px] relative">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeStep}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
              >
                <CourseSteps activeStep={activeStep} courseData={courseData} setCourseData={setCourseData} />
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
        {/* Standard Action Buttons (Inline) */}
        <div className="max-w-[800px] mx-auto p-4 md:px-12 pb-20">
          <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-6">
            <button 
              onClick={handlePrev}
              disabled={activeStep === 1}
              className={`px-5 py-2 rounded-none text-[13px] font-medium transition-colors ${activeStep === 1 ? 'opacity-40 cursor-not-allowed text-gray-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              Back
            </button>
            
            {activeStep < 11 ? (
              <button 
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-none text-[13px] font-semibold"
              >
                Continue
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                disabled={isLoading || isEditLoading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-none text-[13px] font-semibold flex items-center gap-2"
              >
                {isLoading || isEditLoading ? "Publishing..." : (id ? "Update Course" : "Publish Course")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseBuilder;
