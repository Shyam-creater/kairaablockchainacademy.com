import React, { useState } from "react";
import AdminLayout from "../../components/Admin/AdminLayout.js";
import Heading from "../../components/Heading.js";
import AllBlogs from "../../components/Blog/AllBlogs.js";
import CreateBlog from "../../components/Blog/CreateBlog.js";
import { Button } from "@mui/material";

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
          <Button
            variant="contained"
            color={isCreating ? "secondary" : "primary"}
            onClick={() => setIsCreating(!isCreating)}
            sx={{ textTransform: "none", borderRadius: "8px" }}
          >
            {isCreating ? "Back to Blogs" : "+ Create Blog"}
          </Button>
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

