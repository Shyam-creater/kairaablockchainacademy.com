import React, { useState } from "react";
import AdminLayout from "../../components/Admin/AdminLayout.js";
import Heading from "../../components/Heading.js";
import AllBlogs from "../../components/Blog/AllBlogs.js";
import CreateBlog from "../../components/Blog/CreateBlog.js";
import { FiArrowLeft, FiPlus } from "react-icons/fi";

const AdminBlogPage = () => {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <>
      <Heading
        title="Manage Blogs | Admin Portal"
        description="Manage academy blogs"
        keywords="admin, manage blogs"
      />
      <AdminLayout
        title="Manage Blogs"
        subtitle={isCreating ? "Create a new blog post" : "View and manage all blogs"}
        action={
          <button
            onClick={() => setIsCreating(!isCreating)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold uppercase tracking-widest text-sm transition-all shadow-glass ${
              isCreating 
                ? "bg-white/5 border border-slate-600 text-white hover:bg-white/10" 
                : "bg-primary/20 border border-primary/50 text-primary shadow-[0_0_15px_rgba(0,242,254,0.3)] hover:bg-primary hover:text-slate-900"
            }`}
          >
            {isCreating ? (
              <>
                <FiArrowLeft size={16} /> Back to Blogs
              </>
            ) : (
              <>
                <FiPlus size={16} /> Create Blog
              </>
            )}
          </button>
        }
      >
        <div className="w-full mt-4">
          {isCreating ? <CreateBlog /> : <AllBlogs />}
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminBlogPage;

