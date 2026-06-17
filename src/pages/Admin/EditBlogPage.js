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
      <AdminLayout 
        title="Edit Blog Post" 
        subtitle="Update the details or cover image for this blog post"
      >
        <div className="bg-white p-8 rounded-none border border-gray-100 shadow-sm">
          <EditBlog />
        </div>
      </AdminLayout>
    </AdminProtected>
  );
};

export default EditBlogPage;
