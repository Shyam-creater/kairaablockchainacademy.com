import React from "react";
import AdminProtected from "../../utils/hooks/adminProtected.js";
import Heading from "../../components/Heading.js";
import AdminLayout from "../../components/Admin/AdminLayout.js";
import CourseBuilder from "../../components/Admin/CourseBuilder/CourseBuilder.js";
import { useParams } from "react-router-dom";

const EditCoursePage = () => {
  const { id } = useParams();

  return (
    <AdminProtected>
      <Heading title="Edit Course - Admin" description="Edit existing course" keywords="edit course, admin" />
      <AdminLayout title="Edit Course" subtitle="Update course details and content">
        <div className="w-full">
          <CourseBuilder id={id} />
        </div>
      </AdminLayout>
    </AdminProtected>
  );
};

export default EditCoursePage;
