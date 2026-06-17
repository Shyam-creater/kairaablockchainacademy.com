import React from "react";
import AdminProtected from "../../utils/hooks/adminProtected.js";
import Heading from "../../components/Heading.js";
import AdminLayout from "../../components/Admin/AdminLayout.js";
import EditCourse from "../../components/Admin/Course/EditCourse.js";
import { useParams } from "react-router-dom";

const EditCoursePage = () => {
  const { id } = useParams();

  return (
    <AdminProtected>
      <Heading title="Edit Course - Admin" description="Edit existing course" keywords="edit course, admin" />
      <AdminLayout title="Edit Course" subtitle="Modify course details and content">
        <div className="bg-white p-8 rounded-none border border-gray-100 shadow-sm">
          <EditCourse id={id} />
        </div>
      </AdminLayout>
    </AdminProtected>
  );
};

export default EditCoursePage;
