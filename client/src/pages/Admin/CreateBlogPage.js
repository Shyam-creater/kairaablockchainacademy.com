import React from "react";
import AdminProtected from "../../utils/hooks/adminProtected.js";
import Heading from "../../components/Heading.js";
import AdminLayout from "../../components/Admin/AdminLayout.js";
import CreateBlog from "../../components/Blog/CreateBlog.js";

const CreateBlogPage = () => {
  return (
    <AdminProtected>
      <Heading title="Create Blog - Admin" description="Write a new blog post" keywords="create blog, admin" />
      <AdminLayout title="Create New Blog" subtitle="Publish a new article to the platform">
        <div className="w-full">
          <CreateBlog />
        </div>
      </AdminLayout>
    </AdminProtected>
  );
};

export default CreateBlogPage;
