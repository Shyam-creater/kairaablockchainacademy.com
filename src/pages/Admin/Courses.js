import React, { useState } from "react";
import Heading from "../../components/Heading.js";
import AdminLayout from "../../components/Admin/AdminLayout.js";
import AllCourses from "../../components/Admin/Course/AllCourses.js";
import CreateCourse from "../../components/Admin/Course/CreateCourse.js";
import { FiPlus, FiArrowLeft } from "react-icons/fi";

const Courses = () => {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <>
      <Heading
        title="Manage Courses | Admin Portal"
        description="Manage your academy's courses"
        keywords="blockchain course, admin, manage courses"
      />
      <AdminLayout
        title="Manage Courses"
        subtitle={isCreating ? "Create a new course" : "View and manage all courses"}
        action={
          <button
            onClick={() => setIsCreating(!isCreating)}
            className={`flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-none transition-all shadow-sm ${
              isCreating 
                ? "bg-white border border-gray-200 hover:border-gray-300 text-gray-700" 
                : "bg-primary hover:bg-indigo-700 text-white"
            }`}
          >
            {isCreating ? (
              <>
                <FiArrowLeft size={16} /> Back to Courses
              </>
            ) : (
              <>
                <FiPlus size={16} /> Add New Course
              </>
            )}
          </button>
        }
      >
        <div className="w-full h-full">
          {isCreating ? (
            <div className="bg-white rounded-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6">
              <CreateCourse />
            </div>
          ) : (
            <AllCourses />
          )}
        </div>
      </AdminLayout>
    </>
  );
};

export default Courses;
