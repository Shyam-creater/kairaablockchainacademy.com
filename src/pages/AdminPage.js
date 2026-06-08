import React from "react";
import Heading from "../components/Heading";
import AdminSidebar from "../components/Admin/AdminSidebar.js";
import AdminProtected from "../utils/hooks/adminProtected.js";



const AdminPage = () => {
  return (
    // <div>
     <AdminProtected>
     <Heading
        title="Kairaa Blockchain Academy - Admin"
        description=""
        keywords="Blockchain,Blockchain Certification"
      />
      <div className="flex h-[200vh]">
        <div className="1500px:w-[16%] w-1/5">
          <AdminSidebar />
        </div>
        <div className="w-[85%] ">
{/* <DashboardHero/> */}
        </div>
      </div>
     </AdminProtected>
    // </div>
  );
};

export default AdminPage;
