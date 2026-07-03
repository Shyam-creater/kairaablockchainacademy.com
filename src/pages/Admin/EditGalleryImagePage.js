import React from "react";
import AdminProtected from "../../utils/hooks/adminProtected.js";
import Heading from "../../components/Heading.js";
import AdminLayout from "../../components/Admin/AdminLayout.js";
import EditGalleryImage from "../../components/Gallery/EditGalleryImage.js";

const EditGalleryImagePage = () => {
  return (
    <AdminProtected>
      <Heading 
        title="Edit Image - Admin" 
        description="Edit an existing gallery image" 
        keywords="edit, gallery, admin" 
      />
      <AdminLayout title="Edit Gallery Image" subtitle="Update image details">
        <div className="w-full">
          <EditGalleryImage />
        </div>
      </AdminLayout>
    </AdminProtected>
  );
};

export default EditGalleryImagePage;
