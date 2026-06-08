import React from "react";
import AdminProtected from "../utils/hooks/adminProtected.js";
import Heading from "../components/Heading.js";
import AdminSidebar from "../components/Admin/AdminSidebar.js";
import CreateGalleryImage from "../components/Gallery/createGalleryImage.js";

const UploadGalleryImagePage = () => {
  return (
    <AdminProtected>
      <div>
        <Heading title="create course page" description="" keywords="" />
        <div className="flex">
          <div className="1500px:w-[16%] w-1/5">
            <AdminSidebar />
          </div>
          <div className="w-[85%]">
            {/* <DashboardHeader /> */}
            <CreateGalleryImage />
          </div>
        </div>
      </div>
     </AdminProtected>
  );
};
export default UploadGalleryImagePage
