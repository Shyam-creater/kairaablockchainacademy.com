import React from "react";
import AdminProtected from "../../utils/hooks/adminProtected.js";
import Heading from "../../components/Heading.js";
import AdminLayout from "../../components/Admin/AdminLayout.js";
import CourseBuilder from "../../components/Admin/CourseBuilder/CourseBuilder.js";

const CreateCoursePage = () => {
  return (
    <AdminProtected>
      <Heading title="Create Premium Course - Admin" description="Build a new premium course" keywords="create course, admin, premium builder" />
      <AdminLayout title="Course Builder" subtitle="Create an outstanding learning experience">
        <div className="w-full h-full bg-gray-50 dark:bg-gray-900 overflow-hidden">
          <CourseBuilder />
        </div>
      </AdminLayout>
    </AdminProtected>
  );
};

export default CreateCoursePage;
