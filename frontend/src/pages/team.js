import React from 'react';
import Heading from "../components/Heading.js";
import AdminSidebar from "../components/Admin/AdminSidebar.js";
import AdminProtected from "../utils/hooks/adminProtected.js";
import AllUsers from "../components/Admin/Course/AllUsers.js"




const Team = () => {
  return (
    <div>
       <AdminProtected>
    <div>
      <Heading title="create course page" description="" keywords="" />
      <div className="flex ">
        <div className="1500px:w-[16%] w-1/5">
          <AdminSidebar />
        </div>
        <div className="w-[85%]">
          {/* <DashboardHeader /> */}
         <AllUsers isTeam={true}/>
        </div>
      </div>
    </div>
     </AdminProtected>
    </div>
  )
}

export default Team
