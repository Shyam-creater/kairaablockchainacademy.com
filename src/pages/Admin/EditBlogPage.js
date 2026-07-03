import React from "react";
import AdminProtected from "../../utils/hooks/adminProtected.js";
import Heading from "../../components/Heading.js";
import AdminLayout from "../../components/Admin/AdminLayout.js";
import EditBlog from "../../components/Blog/EditBlog.js";

const EditBlogPage = () => {
  return (
    <AdminProtected>
      <Heading 
        title="Edit Blog - Admin" 
        description="Edit an existing blog post" 
        keywords="edit, blog, admin" 
      />
      <AdminLayout title="Edit Blog" subtitle="Update your blog post details">
        <div className="w-full">
          <EditBlog />
        </div>
      </AdminLayout>
    </AdminProtected>
  );
};

export default EditBlogPage;
