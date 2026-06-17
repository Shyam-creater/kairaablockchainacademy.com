import React from "react";
import AdminProtected from "../../utils/hooks/adminProtected.js";
import Heading from "../../components/Heading.js";
import AdminLayout from "../../components/Admin/AdminLayout.js";
import CreateGalleryImage from "../../components/Gallery/createGalleryImage.js";

const UploadGalleryImagePage = () => {
  return (
    <AdminProtected>
      <Heading title="Upload Image - Admin" description="Upload a new gallery image" keywords="upload, gallery, admin" />
      <AdminLayout title="Upload Gallery Image" subtitle="Add new media to the platform gallery">
        <div className="bg-white p-8 rounded-none border border-gray-100 shadow-sm">
          <CreateGalleryImage />
        </div>
      </AdminLayout>
    </AdminProtected>
  );
};
export default UploadGalleryImagePage;
