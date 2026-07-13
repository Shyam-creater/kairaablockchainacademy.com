import React from "react";
import AdminProtected from "../../utils/hooks/adminProtected.js";
import Heading from "../../components/Heading.js";
import AdminLayout from "../../components/Admin/AdminLayout.js";
import CreateGalleryImage from "../../components/Gallery/createGalleryImage.js";

const UploadGalleryImagePage = () => {
  return (
    <AdminProtected>
      <Heading title="Upload Image - Admin" description="Upload a new gallery image" keywords="upload, gallery, admin" />
      <AdminLayout title="Upload Gallery Image" subtitle="Add new media to the gallery">
        <div className="w-full">
          <CreateGalleryImage />
        </div>
      </AdminLayout>
    </AdminProtected>
  );
};
export default UploadGalleryImagePage;
