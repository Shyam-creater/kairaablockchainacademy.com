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
      <AdminLayout 
        title="Edit Gallery Image" 
        subtitle="Update details or replace the media for this gallery item"
      >
        <div className="bg-white p-8 rounded-none border border-gray-100 shadow-sm">
          <EditGalleryImage />
        </div>
      </AdminLayout>
    </AdminProtected>
  );
};

export default EditGalleryImagePage;
