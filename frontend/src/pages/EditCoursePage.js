import React from "react";
import AdminProtected from "../utils/hooks/adminProtected.js";
import Heading from "../components/Heading.js";
import AdminSidebar from "../components/Admin/AdminSidebar.js";

import EditCourse from "../components/Admin/Course/EditCourse.js";
import { useParams } from "react-router-dom";

const EditCoursePage = () => {

const {id}=useParams();
console.log(`editPage ${id}`)

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
        <EditCourse id={id}/>
        </div>
      </div>
    </div>
     </AdminProtected>
  );
};

export default EditCoursePage;
