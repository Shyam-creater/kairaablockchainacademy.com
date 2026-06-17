
import React, { useState } from "react";
import AdminLayout from "../../components/Admin/AdminLayout.js";
import Heading from "../../components/Heading.js";
import AllGalleryImage from "../../components/Gallery/AllGalleryImage.js";
import CreateGalleryImage from "../../components/Gallery/createGalleryImage.js";
import { Button } from "@mui/material";

const AdminGalleryPage = () => {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <>
      <Heading
        title="Manage Gallery | Admin Portal"
        description="Manage academy gallery images"
        keywords="admin, manage gallery"
      />
      <AdminLayout
        title="Manage Gallery"
        subtitle={isCreating ? "Upload new image" : "View and manage gallery"}
        action={
          <Button
            variant="contained"
            color={isCreating ? "secondary" : "primary"}
            onClick={() => setIsCreating(!isCreating)}
            sx={{ textTransform: "none", borderRadius: "8px" }}
          >
            {isCreating ? "Back to Gallery" : "+ Upload Image"}
          </Button>
        }
      >
        <div className="w-full mt-4">
          {isCreating ? <CreateGalleryImage /> : <AllGalleryImage />}
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminGalleryPage;

