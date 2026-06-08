
import React from "react";
import AdminProtected from "../utils/hooks/adminProtected.js";
import Heading from "../components/Heading.js";
import AdminSidebar from "../components/Admin/AdminSidebar.js";
import AllGalleryImage from "../components/Gallery/AllGalleryImage.js";

const AdminGalleryPage = () => {
  return (
    <div>
       <div>
      <AdminProtected>
        <div>
          <Heading title="create course page" description="" keywords="" />
          <div className="flex">
            <div className="1500px:w-[16%] w-1/5">
              <AdminSidebar />
            </div>
            <div className="w-[85%]">
          <AllGalleryImage/>
            </div>
          </div>
        </div>
      </AdminProtected>
    </div>
    </div>
  )
}

export default AdminGalleryPage
