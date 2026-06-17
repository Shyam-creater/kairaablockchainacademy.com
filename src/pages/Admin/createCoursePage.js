import React from "react";
import AdminProtected from "../../utils/hooks/adminProtected.js";
import Heading from "../../components/Heading.js";
import AdminLayout from "../../components/Admin/AdminLayout.js";
import CreateCourse from "../../components/Admin/Course/CreateCourse.js";

const CreateCoursePage = () => {
  return (
    <AdminProtected>
      <Heading title="Create Course - Admin" description="Create a new course" keywords="create course, admin" />
      <AdminLayout title="Create New Course" subtitle="Fill in the details to publish a new course">
        <div className="bg-white p-8 rounded-none border border-gray-100 shadow-sm">
          <CreateCourse />
        </div>
      </AdminLayout>
    </AdminProtected>
  );
};

export default CreateCoursePage;
